import axios from 'axios';
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

const api = axios.create({
  baseURL: 'http://localhost:5186',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = cookies.get('jwt') 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


export const useApi = () => {

  const auth = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth', { username, password });
      return response.data;
    } catch (error) {
      throw new Error('Неверный email или пароль');
    }
  };

  const getCourses = async (params: any) => {
    try {
      const response = await api.get('/courses', {params});
      console.log("Отправляемые фильтры:", params);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getCourseById = async (id: string) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const createCourse = async (courseData: any) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const getAllCourses = async () => {
    try {
      const response = await api.get('/admin/courses');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return {
    getCourses,
    getCourseById,
    createCourse,
    auth,
    getAllCourses,
  };
};