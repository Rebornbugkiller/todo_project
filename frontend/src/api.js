import axios from 'axios';

// 在 Docker 生产环境中，通常通过 import.meta.env.VITE_API_URL 来获取
// 如果没有设置,则默认为公网服务器地址
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://43.140.194.195:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;