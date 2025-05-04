<template>
    <div class="home-view">
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
            <option value="short">До 15 мин</option>
            <option value="medium">15-30 мин</option>
            <option value="long">Более 30 мин</option>
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
      </div>
      
      <LoadingSpinner v-if="isLoading && !error" />
      <ErrorAlert v-else-if="error" :message="error" :retry="fetchCourses" />
      
      <div v-else class="courses-list">
        <CourseCard
          v-for="course in filteredCourses"
          :key="course.id"
          :course="course"
        />
      </div>
      
      <CourseCreator />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed, ref, onMounted } from 'vue';
  import { useCoursesStore } from '@/stores/courses';
  import CourseCard from '@/components/CourseCard.vue';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import ErrorAlert from '@/components/ErrorAlert.vue';
  import CourseCreator from '@/widgets/CourseCreator.vue';
  
  export default defineComponent({
    name: 'HomeView',
    components: {
      CourseCard,
      LoadingSpinner,
      ErrorAlert,
      CourseCreator,
    },
    setup() {
      const coursesStore = useCoursesStore();
      const searchQuery = ref('');
      const categoryFilter = ref('');
      const timeFilter = ref('');
      const hasTestFilter = ref(false);
  
      const fetchCourses = () => {
        coursesStore.fetchCourses();
      };
  
      onMounted(fetchCourses);
  
      const categories = computed(() => {
        const allCategories = coursesStore.courses.map(course => course.category);
        return [...new Set(allCategories)];
      });
  
      const filteredCourses = computed(() => {
        return coursesStore.courses.filter(course => {
          // Фильтр по поисковому запросу
          const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase());
          
          // Фильтр по категории
          const matchesCategory = !categoryFilter.value || course.category === categoryFilter.value;
          
          // Фильтр по времени чтения
          let matchesTime = true;
          if (timeFilter.value === 'short') {
            matchesTime = course.readingTime <= 15;
          } else if (timeFilter.value === 'medium') {
            matchesTime = course.readingTime > 15 && course.readingTime <= 30;
          } else if (timeFilter.value === 'long') {
            matchesTime = course.readingTime > 30;
          }
          
          // Фильтр по наличию теста
          const matchesTest = !hasTestFilter.value || course.hasTest;
          
          return matchesSearch && matchesCategory && matchesTime && matchesTest;
        });
      });
  
      return {
        isLoading: computed(() => coursesStore.isLoading),
        error: computed(() => coursesStore.error),
        courses: computed(() => coursesStore.courses),
        filteredCourses,
        categories,
        searchQuery,
        categoryFilter,
        timeFilter,
        hasTestFilter,
        fetchCourses,
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
  </style>