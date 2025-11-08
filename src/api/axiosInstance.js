import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://194.67.82.193:8080/api',
  timeout: 10000,
});

const authWhitelist = ['/auth/login', '/auth/register'];

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const isAuthEndpoint = authWhitelist.some((endpoint) => config.url?.includes(endpoint));

  if (!isAuthEndpoint && token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
