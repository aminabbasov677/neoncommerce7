import React from "react";
import "./Loading.css";

function Loading() {
  return React.createElement('div', { className: 'loading-container glass-effect' },
    React.createElement('div', { className: 'loading-spinner' }),
    React.createElement('p', { className: 'neon-effect' }, 'Loading...')
  );
}

export default Loading;
