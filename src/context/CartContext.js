import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useTracking } from "./TrackingContext";

const initialState = {
  items: [],
  total: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price,
      };
    }
    case "REMOVE_FROM_CART": {
      const item = state.items.find((item) => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        total: state.total - item.price * item.quantity,
      };
    }
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      const quantityDiff = quantity - item.quantity;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
        total: state.total + item.price * quantityDiff,
      };
    }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
      };
    case "CHECKOUT":
      return {
        ...state,
        items: [],
        total: 0,
      };
    default:
      return state;
  }
};

const generateTrackingNumber = () => {
  return 'TRK' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
};

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const trackingContext = useTracking();

  const enhancedDispatch = (action) => {
    if (action.type === "CHECKOUT" && trackingContext?.dispatch) {
      const orderId = Date.now();
      const trackingNumber = generateTrackingNumber();
      const orders = state.items.map(item => ({
        id: `${item.id}-${orderId}`,
        product: item,
        status: 'In Warehouse',
        timestamp: Date.now(),
        orderId,
        trackingNumber,
      }));
      trackingContext.dispatch({ type: "ADD_ORDER", payload: orders });
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      storedOrders.push(...orders);
      localStorage.setItem('orders', JSON.stringify(storedOrders));
    }
    dispatch(action);
  };

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: "CLEAR_CART" });
      parsedCart.items.forEach((item) => {
        dispatch({ type: "ADD_TO_CART", payload: item });
      });
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch: enhancedDispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};