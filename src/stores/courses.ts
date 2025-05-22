import { defineStore } from 'pinia';
import { useApi } from '@/api/useApi';
import { ref } from 'vue';
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

export const useCoursesStore = defineStore('courses', () => {
  const courses = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const { getCourses, getCourseById, createCourse } = useApi();

  const fetchCourses = async (params: any) => {
    isLoading.value = true;
    error.value = null;
    try {
      courses.value = await getCourses(params);
    } catch (err) {
      error.value = 'Не удалось загрузить курсы';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchCourseById = async (id: string) => {
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
      const courseDataWithUser = {
        ...courseData,
        authorToken: cookies.get("jwt")
      }
      await createCourse(courseDataWithUser);
      await fetchCourses({});
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