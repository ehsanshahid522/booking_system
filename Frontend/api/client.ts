import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your local machine's IP address when running on a physical device
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';

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

// Response interceptor to handle unauthenticated 401s globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // You can implement logout or token refresh logic here
      console.log('Unauthorized access detected!');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
