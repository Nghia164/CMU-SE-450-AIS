// file: frontend/src/api.js
import axios from 'axios';

// Thiết lập Base URL kết nối thẳng tới Backend Python FastAPI
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

export default API;