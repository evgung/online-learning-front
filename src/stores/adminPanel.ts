import { defineStore } from 'pinia';
import { useApi } from '@/api/useApi';
import { ref } from 'vue';

export const useAdminPanelStore = defineStore('adminPanel', () => {
  const courses = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const { getAllCourses } = useApi();

  const fetchAllCourses = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      courses.value = await getAllCourses();
    } catch (err) {
      error.value = 'Не удалось загрузить курсы';
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    courses,
    isLoading,
    error,
    fetchAllCourses,
  };
});