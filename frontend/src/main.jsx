import React from 'react';
import ReactDOM from 'react-dom/client';
// Import dark-mode.css first, then themes.css
import './styles/dark-mode.css';
import './styles/themes.css';
import './styles/variables.css';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
