import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () =>
      fetch(`https://fakestoreapi.com/products/${id}`).then((res) =>
        res.json()
      ),
  });

  const addToCart = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success("Səbətə əlavə olundu!");
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return React.createElement('div', { className: 'loading-container' },
      React.createElement('div', { className: 'loading-spinner' })
    );
  }

  if (error) {
    return React.createElement('div', { className: 'error-container' },
      React.createElement('p', null, 'Məhsul yüklənmədi. Zəhmət olmasa, yenidən cəhd edin.')
    );
  }

  return React.createElement(motion.div, {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    className: 'product-detail-container'
  },
    React.createElement(motion.button, {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      onClick: handleBack,
      className: 'back-button'
    }, 'Back'),
    React.createElement('div', { className: 'product-detail' },
      React.createElement(motion.div, {
        initial: { x: -50 },
        animate: { x: 0 },
        className: 'product-image-container'
      },
        React.createElement('img', {
          src: product.image,
          alt: product.title,
          className: 'product-image'
        })
      ),
      React.createElement(motion.div, {
        initial: { x: 50 },
        animate: { x: 0 },
        className: 'product-info'
      },
        React.createElement('h1', { className: 'product-title' }, product.title),
        React.createElement('p', { className: 'product-category' }, product.category),
        React.createElement('p', { className: 'product-description' }, product.description),
        React.createElement('div', { className: 'product-price-container' },
          React.createElement('span', { className: 'product-price' }, `$${product.price}`),
          React.createElement('div', { className: 'product-rating' },
            React.createElement('span', null, `Reytinq: ${product.rating.rate}`),
            React.createElement('span', null, `(${product.rating.count} rəy)`)
          )
        ),
        React.createElement(motion.button, {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          onClick: addToCart,
          className: 'add-to-cart-button'
        }, 'Add to Cart')
      )
    )
  );
}

export default ProductDetail;
