import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use YOUR actual IP address from ipconfig (192.168.1.5)
// Make sure your backend is running on port 5000
const API_URL = 'http://192.168.1.26:5000/api/';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur récupération token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server not responding');
    } else if (error.message === 'Network Error') {
      console.error('Network Error - Cannot connect to:', API_URL);
      console.error('Make sure:');
      console.error('1. Backend is running on port 5000');
      console.error('2. Backend is accessible at:', API_URL);
      console.error('3. Windows Firewall allows port 5000');
      console.error('4. Phone is on same WiFi network');
    }
    return Promise.reject(error);
  }
);

export default api;