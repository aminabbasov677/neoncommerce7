import React from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "./Cart.css";

function Cart() {
  const { state, dispatch } = useCart();

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
    toast.success("Item removed from cart");
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  if (state.items.length === 0) {
    return React.createElement(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: 'empty-cart'
      },
      React.createElement('h2', null, 'Your cart is empty'),
      React.createElement(
        Link,
        { to: '/', className: 'continue-shopping' },
        'Continue Shopping'
      )
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="cart-container"
    >
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-items">
        {state.items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            className="cart-item"
          >
            <div className="item-image">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="item-details">
              <h3 className="item-title">{item.title}</h3>
              <p className="item-price">${item.price}</p>
            </div>

            <div className="quantity-controls">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="quantity-btn"
              >
                -
              </button>
              <span className="quantity">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="quantity-btn"
              >
                +
              </button>
            </div>

            <div className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeFromCart(item.id)}
              className="remove-btn"
            >
              Remove
            </motion.button>
          </motion.div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${state.total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${state.total.toFixed(2)}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="checkout-btn"
          onClick={() => {
            dispatch({ type: "CHECKOUT" });
            toast.success("Order placed successfully! You can track your delivery in the tracking page.");
          }}
        >
          Proceed to Checkout
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Cart;
