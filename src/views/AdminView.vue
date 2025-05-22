<template>
  <div class="admin-panel">
    <h1>Админ-панель</h1>
    <div class="courses-list">
      <div v-for="course in courses" :key="course.id" class="admin-course">
        <h3>{{ course.title }}</h3>
        <p>Создатель: {{ course.author.username }}</p>
      </div>
    </div>
    <router-link to="/" class="back-link">На главную</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from 'vue'
import { useAdminPanelStore } from '@/stores/adminPanel'

export default defineComponent({
  setup() {
    const coursesStore = useAdminPanelStore();

    const fetchCourses = () => {
      coursesStore.fetchAllCourses();
    };

    onMounted(fetchCourses);

    return {
      courses: computed(() => coursesStore.courses)
    }
  }
})
</script>

<style scoped>
.admin-panel {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.admin-course {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
}

.back-link {
  display: inline-block;
  margin-top: 20px;
}
</style>