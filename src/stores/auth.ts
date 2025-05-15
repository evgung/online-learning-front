import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useApi } from '@/api/useApi';
import { useRouter } from 'vue-router';
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()

export const useAuthStore = defineStore('auth', () => {
  const { auth } = useApi();
  const router = useRouter();
  
  const userId = ref<number | null>(null);
  const isAuthenticated = ref(false);
  const isAdmin = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      isLoading.value = true;
      error.value = null;
      const response = await auth(username, password);

      isAuthenticated.value = true;
      router.push('/');
    } catch (err: any) {
      error.value = err.message || 'Ошибка входа';
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    cookies.remove('jwt');
    cookies.remove('id');
    cookies.remove('isAdmin');
    
    isAuthenticated.value = false;
    router.push('/login');
  }

  const init = () => {
    if (cookies.get('id')) {
      isAuthenticated.value = true;
      isAdmin.value = cookies.get('isAdmin') === 'True'
    }
  }

  return {
    userId,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    login,
    logout,
    init
  };
});