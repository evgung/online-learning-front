<template>
    <div class="course-card">
      <h3>{{ course.title }}</h3>
      <div class="course-meta">
        <span class="category">{{ course.category }}</span>
        <span class="time">{{ course.readingTime }} мин</span>
        <span class="test-badge" v-if="course.hasTest">Тест</span>
      </div>
      <router-link :to="{ name: 'course', params: { id: course.id } }" class="view-btn">
        Открыть курс
      </router-link>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    name: 'CourseCard',
    props: {
      course: {
        type: Object as PropType<{
          id: number;
          title: string;
          category: string;
          readingTime: number;
          hasTest: boolean;
        }>,
        required: true,
      },
    },
  });
  </script>
  
  <style scoped>
  .course-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    transition: box-shadow 0.3s;
  }
  
  .course-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .course-meta {
    display: flex;
    gap: 10px;
    margin: 10px 0;
    font-size: 0.9em;
    color: #666;
  }
  
  .test-badge {
    background-color: #4caf50;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.8em;
  }
  
  .view-btn {
    display: inline-block;
    padding: 8px 16px;
    background-color: #2196f3;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-size: 0.9em;
  }
  
  .view-btn:hover {
    background-color: #0d8bf2;
  }
  </style>