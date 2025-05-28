import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import Slider from "react-slick";
import toast from "react-hot-toast";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const { dispatch } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const productsPerPage = 9;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const {
    data: categoriesData = [],
    isLoading: categoriesLoadingData,
    error: categoriesErrorData,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      fetch("https://fakestoreapi.com/products/categories").then((res) =>
        res.json()
      ),
  });

  const {
    data: products = [],
    isLoading: productsLoading,
    error: productsError,
  } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () =>
      fetch(
        selectedCategory
          ? `https://fakestoreapi.com/products/category/${selectedCategory}`
          : "https://fakestoreapi.com/products"
      ).then((res) => res.json()),
  });

  useEffect(() => {
    // Simulate API call for categories
    setTimeout(() => {
      setCategories(["electronics", "clothing", "books", "home"]);
      setCategoriesLoading(false);
    }, 1000);
  }, []);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success("Added to cart!");
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    appendDots: (dots) => React.createElement('div', null,
      React.createElement('ul', { className: 'slick-dots-custom' }, dots)
    ),
    customPaging: () => React.createElement('div', { className: 'slick-dot-custom' })
  };

  const banners = [
    "https://www.digiseller.ru/preview/1088750/p1_3690821_b9d2a549.jpg",
    "https://i.ytimg.com/vi/aqTtwGwwOhA/maxresdefault.jpg",
    "https://i.ytimg.com/vi/cTDU-u84x5Q/maxresdefault.jpg",
    "https://i.ytimg.com/vi/D_oPnckCSUI/maxresdefault.jpg?7857057827",
    "https://i.ytimg.com/vi/lKh2pHCbtno/maxresdefault.jpg",
    "https://i.ytimg.com/vi/3WvQvmCEX4w/maxresdefault.jpg",
  ];

  if (productsLoading || categoriesLoadingData) {
    return React.createElement('div', { className: 'loading-container glass-effect' },
      React.createElement('div', { className: 'loading-spinner' }),
      React.createElement('p', { className: 'neon-effect' }, 'Loading...')
    );
  }

  if (productsError || categoriesErrorData) {
    return React.createElement('div', { className: 'error-container glass-effect' },
      React.createElement('p', { className: 'neon-effect' },
        `Error: ${productsError?.message || categoriesErrorData?.message}`
      )
    );
  }

  return React.createElement('div', { className: 'home-container' },
    React.createElement(motion.h1, {
      initial: { y: -20 },
      animate: { y: 0 },
      className: 'page-title gradient-text'
    }, 'Welcome to YourShop'),
    React.createElement(motion.div, {
      className: 'slider-container',
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay: 0.2 }
    },
      React.createElement(Slider, sliderSettings,
        banners.map((banner, index) => React.createElement('div', {
          key: index,
          className: 'slider-item'
        },
          React.createElement('img', {
            src: banner,
            alt: `Banner ${index + 1}`
          })
        ))
      )
    ),
    React.createElement(motion.div, {
      className: 'category-container',
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    },
      React.createElement('div', { className: 'category-buttons' },
        React.createElement(motion.button, {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          className: `category-btn ${!selectedCategory ? "active" : ""}`,
          onClick: () => handleCategoryChange(null),
          'aria-pressed': !selectedCategory
        }, 'All Categories'),
        categories.map((category) => React.createElement(motion.button, {
          key: category,
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          className: `category-btn ${selectedCategory === category ? "active" : ""}`,
          onClick: () => handleCategoryChange(category),
          'aria-pressed': selectedCategory === category
        }, category.charAt(0).toUpperCase() + category.slice(1)))
      )
    ),
    React.createElement('div', { className: 'products-grid' },
      currentProducts.length === 0 ? React.createElement('div', { className: 'no-results glass-effect' },
        React.createElement('p', { className: 'neon-effect' }, 'No products found in this category.')
      ) : currentProducts.map((product) => React.createElement('div', {
        key: product.id,
        className: 'product-card'
      },
        React.createElement('div', { className: 'product-image' },
          React.createElement(Link, { to: `/product/${product.id}` },
            React.createElement('img', {
              src: product.image,
              alt: product.title
            })
          )
        ),
        React.createElement('div', { className: 'content' },
          React.createElement(Link, { to: `/product/${product.id}` },
            React.createElement('h3', { className: 'product-title neon-effect' }, product.title),
            React.createElement('p', { className: 'product-price' }, `$${product.price.toFixed(2)}`)
          ),
          React.createElement(motion.button, {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
            onClick: () => addToCart(product),
            className: 'add-to-cart-btn btn-primary'
          }, 'Add to Cart')
        )
      ))
    ),
    React.createElement('div', { className: 'pagination-container' },
      React.createElement(motion.button, {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        className: `pagination-btn ${currentPage === 1 ? "disabled" : ""}`,
        onClick: () => handlePageChange(currentPage - 1),
        disabled: currentPage === 1,
        'aria-label': 'Previous page'
      }, 'Previous'),
      React.createElement('span', { className: 'pagination-current', 'aria-live': 'polite' },
        `${currentPage} / ${totalPages}`
      ),
      React.createElement(motion.button, {
        whileHover: { scale: 1.1 },
        whileTap: { scale: 0.9 },
        className: `pagination-btn ${currentPage === totalPages ? "disabled" : ""}`,
        onClick: () => handlePageChange(currentPage + 1),
        disabled: currentPage === totalPages,
        'aria-label': 'Next page'
      }, 'Next')
    )
  );
}

export default Home;