<template>
  <div class="header-actions" v-if="isAdmin">
    <button @click="goToAdminPanel" class="admin-button">Админ-панель</button>
  </div>

  <div v-if="isAuthenticated" class="home-view">
    <h1>Онлайн обучение</h1>

    <div class="search-filters">
      <div class="filter-group">
        <label>Тематика:</label>
        <select v-model="categoryFilter">
          <option value="">Все</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Время чтения:</label>
        <select v-model="timeFilter">
          <option value="">Любое</option>
          <option value="15">До 15 мин</option>
          <option value="30">До 30 мин</option>
          <option value="60">До 60 мин</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>
          <input type="checkbox" v-model="hasTestFilter" />
          Только с тестом
        </label>
      </div>
      
      <div class="filter-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск по названию..."
        />
      </div>

      <button @click="applyFilters" class="apply-filters-button">
        Применить фильтры
      </button>
    </div>
    
    <LoadingSpinner v-if="isLoading && !error" />
    <ErrorAlert v-else-if="error" :message="error" :retry="fetchCourses" />
    
    <div v-else class="courses-list">
      <CourseCard
        v-for="course in courses"
        :key="course.id"
        :course="course"
      />
    </div>
    
    <CourseCreator />
  </div>
</template>
  
  <script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth'
  import { useCoursesStore } from '@/stores/courses';
  import CourseCard from '@/components/CourseCard.vue';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import ErrorAlert from '@/components/ErrorAlert.vue';
  import CourseCreator from '@/widgets/CourseCreator.vue';
  import { useRouter } from 'vue-router'
  
  export default defineComponent({
    name: 'HomeView',
    components: {
      CourseCard,
      LoadingSpinner,
      ErrorAlert,
      CourseCreator,
    },
    setup() {
      const authStore = useAuthStore();
      const coursesStore = useCoursesStore();
      const searchQuery = ref('');
      const categoryFilter = ref('');
      const timeFilter = ref('');
      const hasTestFilter = ref(false);
      const router = useRouter()
      const isAuthenticated = computed(() => authStore.isAuthenticated)
      const isAdmin = computed(() => authStore.isAdmin)

      const goToAdminPanel = () => {
        router.push('/admin')
      }

      const applyFilters = () => {
        const filters = {
          searchQuery: searchQuery.value,
          category: categoryFilter.value,
          readingTime: timeFilter.value,
          hasTest: hasTestFilter.value || undefined
        };
        coursesStore.fetchCourses(filters);
      };

      const fetchCourses = () => {
        coursesStore.fetchCourses({});
      };
  
      onMounted(fetchCourses);
  
      const categories = [
        "Программирование",
        "Дизайн",
        "Маркетинг",
        "Бизнес"
      ];
  
      return {
        isLoading: computed(() => coursesStore.isLoading),
        error: computed(() => coursesStore.error),
        courses: computed(() => coursesStore.courses),
        categories,
        searchQuery,
        categoryFilter,
        timeFilter,
        hasTestFilter,
        fetchCourses,
        isAuthenticated,
        isAdmin,
        goToAdminPanel,
        applyFilters
      };
    },
  });
  </script>
  
  <style scoped>
  .home-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .search-filters {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin: 20px 0;
    padding: 15px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
  }
  
  .filter-group label {
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .filter-group input[type='text'],
  .filter-group select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .filter-group input[type='checkbox'] {
    margin-right: 5px;
  }
  
  .courses-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.admin-button {
  padding: 10px 20px;
  background-color: #4c51bf;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.admin-button:hover {
  background-color: #434190;
}

.admin-button::before {
  content: "⚙️";
  font-size: 16px;
}

  </style>