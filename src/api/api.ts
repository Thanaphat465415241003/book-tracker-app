import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// URL ของ Backend (ใช้ 10.0.2.2 สำหรับ Android Emulator)
const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api/' : 'http://localhost:5000/api/';

const api = axios.create({
  baseURL: API_URL,
});

// การตั้งค่านี้จะแนบ Token ไปกับทุก Request ที่ต้องมีการยืนยันตัวตน
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
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