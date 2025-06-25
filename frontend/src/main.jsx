import React from 'react';
import ReactDOM from 'react-dom/client';
// Import the consolidated theme file
import './styles/theme-system.css';
// Keep index.css for any other global styles
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
