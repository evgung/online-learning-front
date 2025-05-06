import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const useApi = () => {
  const getCourses = async () => {
    try {
      const response = await api.get('/courses');
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

  return {
    getCourses,
    getCourseById,
    createCourse,
  };
};