import { APP_BASE_URL } from '@/app/api/utils/const';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: APP_BASE_URL,
});

export default axiosInstance;
