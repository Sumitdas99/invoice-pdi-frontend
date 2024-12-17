import axios from 'axios';

// Backend URLs
const invoiceUrl = import.meta.env.VITE_BACKEND_URL; // First backend URL

// Helper function to retrieve a cookie by name
const getCookie = name => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Function to create an Axios instance
const createAxiosInstance = baseURL => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json', // Default header for JSON requests
    },
    withCredentials: true, // Ensures cookies are sent with requests
  });

  // Request interceptor
  instance.interceptors.request.use(
    config => {
      const token = getCookie('pdi_cookie'); // Change the cookie name if necessary
      if (token) {
        config.headers.Authorization = `${token}`;
      }
      return config;
    },
    error => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    response => response,
    error => {
      console.error('Response Error:', error);
      if (error.response) {
        const { status } = error.response;
        if (status === 401) {
          console.error('Unauthorized: Redirect to login.');
          window.location.href = '/login'; // Adjust based on your app's routing
        } else if (status === 403) {
          console.error("Forbidden: You don't have access.");
        } else if (status === 500) {
          console.error('Server Error: Something went wrong.');
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Create Axios instances
const instance1 = createAxiosInstance(invoiceUrl); // For the first backend

// HTTP methods for the first instance
export const getFromInstance1 = (url, params) => instance1.get(url, { params });
export const postToInstance1 = (url, data) => {
  let headers = {};
  if (data instanceof FormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }
  return instance1.post(url, data, { headers });
};
export const putToInstance1 = (url, data) => instance1.put(url, data);
export const deleteFromInstance1 = (url, data) =>
  instance1.delete(url, { data });

export { instance1 };
