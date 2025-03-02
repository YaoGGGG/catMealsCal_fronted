import axios from 'axios';

// Create the Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/', // Adjust the base URL as needed
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  withCredentials: true, // Ensures cookies like CSRF token are sent with requests
  xsrfCookieName: 'csrftoken',  // Default name for CSRF token cookie in Django
  xsrfHeaderName: 'X-CSRFToken',  // CSRF token is sent in this header

});

// Configure CSRF token handling
// apiClient.defaults.xsrfCookieName = 'csrftoken';
// apiClient.defaults.xsrfHeaderName = 'X-CSRFTOKEN';

// Helper function to check if the token is expired
function isTokenExpired(token) {
  if (!token) return true;

  const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
  const expiry = payload.exp; // Get expiration time in seconds
  const now = Math.floor(Date.now() / 1000); // Current time in seconds

  return expiry < now; // Token is expired if current time is greater than expiration
}

// Helper function to refresh the token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await axios.post('http://localhost:8000/api/token/refresh/', {
    refresh: refreshToken,
  });

  localStorage.setItem('access_token', response.data.access);
  return response.data.access;
}

// Add a request interceptor to attach the access token to all requests
apiClient.interceptors.request.use(
  async (config) => {
    const isRecipeRequest = config.url.includes('/api/recipes/'); 
    const isCalculatorRequest = config.url.startsWith('/api/calculator/');
    const needsToken= !config.url.includes('/signup') && !config.url.includes('/login')&&!isRecipeRequest;
    
    if (needsToken|| isCalculatorRequest){
      let token = localStorage.getItem('access_token');
    if (isTokenExpired(token)) {
      try {
        token = await refreshAccessToken();
      } catch (error) {
        console.error('Error refreshing token:', error);
        throw error;
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh when expired
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        localStorage.setItem('access_token', newToken);

        // Update original request with new token
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return apiClient(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Optional: Redirect to login or handle refresh failure
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;