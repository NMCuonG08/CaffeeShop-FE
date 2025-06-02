import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 10000,                      
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
    
    return null;
  } catch (error) {
    console.error('Error getting token from persist:', error);
    return null;
  }
};

apiClient.interceptors.request.use(
  (config) => {
    // Thêm token nếu có
    const token = getTokenFromPersist();
  
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('Request with token:', token ? 'Token found' : 'No token');
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
        localStorage.removeItem('persist:auth'); // hoặc key persist của bạn
        // Hoặc dispatch logout action để clear store
        window.location.href = '/login';
      } catch (e) {
        console.error('Error clearing persist data:', e);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;