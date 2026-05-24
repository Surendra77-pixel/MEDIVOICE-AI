import axios from 'axios';

// Ensure /api/v1 is properly appended if the user forgets it in Vercel
let backendUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3000/api/v1');
if (backendUrl.includes('onrender.com') && !backendUrl.includes('/api/v1')) {
  backendUrl = backendUrl.replace(/\/$/, '') + '/api/v1';
}

const api = axios.create({
  baseURL: backendUrl,
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
