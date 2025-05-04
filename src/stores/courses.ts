import { defineStore } from 'pinia';
import { useApi } from '@/composables/useApi';
import { ref } from 'vue';

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const { getCourses, getCourseById, createCourse } = useApi();

  const fetchCourses = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      courses.value = await getCourses();
    } catch (err) {
      error.value = 'Не удалось загрузить курсы';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCourseById = async (id: number) => {
    isLoading.value = true;
    error.value = null;
    try {
      return await getCourseById(id);
    } catch (err) {
      error.value = 'Не удалось загрузить курс';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const addCourse = async (courseData: any) => {
    isLoading.value = true;
    error.value = null;
    try {
      const newCourse = await createCourse(courseData);
      courses.value.push(newCourse);
      return newCourse;
    } catch (err) {
      error.value = 'Не удалось создать курс';
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    courses,
    isLoading,
    error,
    fetchCourses,
    fetchCourseById,
    addCourse,
  };
});