import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3000/api/v1'),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response && error.response.status === 401) {
      // Clear user session if needed (logic will be in AuthContext)
    }
    return Promise.reject(error);
  }
);

export default api;
