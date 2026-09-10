import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Replace with your local machine's IP address when running on a physical device
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:5005/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    
    if (error.response && error.response.status === 401) {
      // Unauthorized - session expired or invalid
      console.log('Unauthorized access detected!');
      // You could also trigger a logout here if needed
    }

    // Only show Alert for non-401 errors, or handle 401 specially
    // For now, let's just log it and reject so the caller can handle it if they want
    // But we'll provide a cleaner error object
    
    return Promise.reject(error);
  }
);

export default apiClient;
