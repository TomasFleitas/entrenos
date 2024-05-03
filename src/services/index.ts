import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: window.location.href,
});

export default axiosInstance;
