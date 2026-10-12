// file: frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import file chứa cấu hình Tailwind
import App from './App';

// Render giao diện App.jsx vào thẻ root của trình duyệt
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);