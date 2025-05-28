import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { TrackingProvider } from './context/TrackingContext';

console.log('Starting application initialization...');

const isBrowserCompatible = () => {
  console.log('Checking browser compatibility...');
  const features = {
    es6: typeof Symbol !== 'undefined' && typeof Symbol.iterator !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    localStorage: typeof localStorage !== 'undefined',
    sessionStorage: typeof sessionStorage !== 'undefined',
  };
  const isCompatible = Object.values(features).every(feature => feature === true);
  console.log('Browser compatibility check result:', isCompatible);
  return isCompatible;
};

const renderApp = () => {
  try {
    console.log('Attempting to render application...');
    if (!isBrowserCompatible()) {
      throw new Error('Your browser is not compatible with this application. Please use a modern browser.');
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    console.log('Root element found, rendering React application...');
    
    root.render(
      <React.StrictMode>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <TrackingProvider>
                <App />
              </TrackingProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </React.StrictMode>
    );
    console.log('React application rendered successfully');
  } catch (error) {
    console.error('Failed to render application:', error);
    document.getElementById('root').innerHTML = `
      <div class="error-container">
        <h1>Failed to load application</h1>
        <p>${error.message}</p>
        <button onclick="window.location.reload()" class="retry-button">Retry</button>
      </div>
    `;
  }
};

console.log('Calling renderApp...');
renderApp();