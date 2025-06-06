import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 30000,                      
  headers: {
    'Content-Type': 'application/json',
  },
});

const getTokenFromPersist = () => {
  try {
    const persistKey = 'persist:auth'; 
    const persistData = localStorage.getItem(persistKey);
    
    if (persistData) {
      const parsedData = JSON.parse(persistData);
      
      if (parsedData.token) {
        const token = JSON.parse(parsedData.token);
        return token;
      }
    }
    
    // Fallback: Check direct localStorage token (for OAuth callbacks)
    const directToken = localStorage.getItem('token');
    if (directToken) {
      return directToken;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting token from persist:', error);
    return null;
  }
};

// Helper function để set token manually
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Token set manually:', token ? 'Present' : 'None');
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    console.log('🚫 Token cleared');
  }
};

apiClient.interceptors.request.use(
  (config) => {
    // Chỉ thêm token từ persist nếu chưa có Authorization header
    if (!config.headers.Authorization) {
      const token = getTokenFromPersist();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    console.log('Request with token:', config.headers.Authorization ? 'Token found' : 'No token');
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    if (error.response?.status === 401) {
      // Xử lý unauthorized - clear persist store
      try {
        localStorage.removeItem('persist:auth');
        localStorage.removeItem('token'); // Clear direct token too
        delete apiClient.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      } catch (e) {
        console.error('Error clearing persist data:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;