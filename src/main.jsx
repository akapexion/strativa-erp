import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {GooeyToaster} from 'goey-toast';
import "goey-toast/styles.css";
import axios from "axios";

import { API_BASE_URL } from './config/api.js';

// Global Axios interceptor for JWT authentication & dynamic API URL
axios.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith("http://localhost:5000")) {
      config.url = config.url.replace("http://localhost:5000", API_BASE_URL);
    }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <GooeyToaster position="top-right" />
  </StrictMode>,
)
