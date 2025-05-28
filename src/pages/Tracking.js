import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTracking } from '../context/TrackingContext';
import { useCart } from '../context/CartContext';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import toast from 'react-hot-toast';
import './Tracking.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function Tracking() {
  const { state: trackingState, dispatch: trackingDispatch } = useTracking();
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const stages = [
    { name: 'In Warehouse', duration: 0 },
    { name: 'Shipped', duration: 10000 },
    { name: 'Arrived in Country', duration: 20000 },
    { name: 'At Post Office', duration: 25000 },
    { name: 'Delivered', duration: 30000 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
      trackingState.orders.forEach(order => {
        const elapsed = Date.now() - order.timestamp;
        const currentStage = stages.find(stage => elapsed < stage.duration) || stages[stages.length - 1];
        if (order.status !== currentStage.name) {
          trackingDispatch({ type: 'UPDATE_STATUS', payload: { id: order.id, status: currentStage.name } });
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [trackingState.orders, trackingDispatch]);

  const chartData = selectedOrder ? {
    labels: stages.map(stage => stage.name),
    datasets: [{
      label: 'Tracking Progress',
      data: stages.map((stage, index) => {
        const elapsed = currentTime - selectedOrder.timestamp;
        return elapsed >= stage.duration ? index + 1 : 0;
      }),
      borderColor: '#00ffc3',
      backgroundColor: 'rgba(0, 255, 195, 0.3)',
      pointBackgroundColor: '#00d1ff',
      pointBorderColor: '#00ffc3',
      pointRadius: 6,
      tension: 0.4,
    }],
  } : {};

  const chartOptions = {
    animation: { duration: 1000, easing: 'easeInOutQuad' },
    scales: {
      y: { display: false, max: stages.length },
      x: { grid: { color: 'rgba(0, 255, 195, 0.3)' } },
    },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1a1a1a', titleColor: '#00ffc3', bodyColor: '#00ffc3' },
    },
  };

  if (trackingState.orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="tracking-container empty-tracking"
      >
        <h1 className="page-title">Order Tracking</h1>
        <p>No orders to track.</p>
        <motion.a
          href="/"
          className="continue-shopping"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Shop More
        </motion.a>
      </motion.div>
    );
  }

  if (selectedOrder) {
    const elapsed = currentTime - selectedOrder.timestamp;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="tracking-container"
      >
        <motion.button
          className="back-button"
          onClick={() => setSelectedOrder(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Orders
        </motion.button>
        <h1 className="page-title">Order Details: {selectedOrder.product.title}</h1>
        <div className="tracking-timeline">
          {stages.map((stage, index) => (
            <div
              key={stage.name}
              className={`tracking-stage ${elapsed >= stage.duration ? 'active' : ''}`}
            >
              <div className="stage-icon"></div>
              <span>{stage.name}</span>
            </div>
          ))}
        </div>
        <div className="tracking-chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="tracking-container"
    >
      <h1 className="page-title">Order Tracking</h1>
      <div className="products-grid">
        {trackingState.orders.map(order => (
          <motion.div
            key={order.id}
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            className="product-card"
          >
            <img src={order.product.image} alt={order.product.title} />
            <div className="content">
              <h3 className="title">{order.product.title}</h3>
              <p className="product-price">${order.product.price}</p>
              <p className="product-status">Order Status: {order.status}</p>
            </div>
            <div className="button-container">
              <motion.button
                className="track-delivery-btn"
                onClick={() => setSelectedOrder(order)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Track Order
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mobile-popup">
        <motion.button
          className="track-delivery-btn"
          onClick={() => setSelectedOrder(trackingState.orders[0])}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Track Order
        </motion.button>
      </div>
    </motion.div>
  );
}

export default Tracking;