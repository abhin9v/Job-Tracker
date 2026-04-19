import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL: apiUrl });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('jf_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
