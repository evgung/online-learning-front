<template>
    <div class="course-view">
      <router-link to="/" class="back-link">← Назад к списку курсов</router-link>
      
      <LoadingSpinner v-if="isLoading && !error" />
      <ErrorAlert v-else-if="error" :message="error" :retry="fetchCourse" />
      
      <div v-else-if="course" class="course-content">
        <div class="course-header">
          <h1>{{ course.title }}</h1>
          <div class="course-meta">
            <span class="category">{{ course.category }}</span>
            <span class="time">{{ course.readingTime }} мин чтения</span>
          </div>
        </div>
        
        <div class="course-blocks">
          <div v-for="(block, index) in course.textBlocks" :key="index" class="block">
            <h3>{{ block.title }}</h3>
            <p>{{ block.content }}</p>
          </div>
        </div>
        
        <div v-if="course.hasTest && course.testQuestions.length > 0" class="course-test">
          <h2>Тест по материалу</h2>
          <div v-if="!testSubmitted" class="test-questions">
            <div v-for="(question, qIndex) in course.testQuestions" :key="qIndex" class="question">
              <h4>{{ qIndex + 1 }}. {{ question.question }}</h4>
              <div v-for="(option, oIndex) in question.answers" :key="oIndex" class="option">
                <input
                  type="radio"
                  :name="'q' + qIndex"
                  :id="'q' + qIndex + 'o' + oIndex"
                  :value="oIndex"
                  v-model="userAnswers[qIndex]"
                />
                <label :for="'q' + qIndex + 'o' + oIndex">{{ option }}</label>
              </div>
            </div>
            <button @click="submitTest" class="submit-btn">Проверить ответы</button>
          </div>
          
          <div v-else class="test-results">
            <h3>Результаты теста</h3>
            <p>Вы ответили правильно на {{ correctAnswers }} из {{ course.testQuestions.length }} вопросов</p>
            <p>Процент правильных ответов: {{ testPercentage }}%</p>
            
            <div v-for="(question, qIndex) in course.testQuestions" :key="'r' + qIndex" class="result-item">
              <h4>{{ qIndex + 1 }}. {{ question.question }}</h4>
              <p>
                Ваш ответ: 
                <span :class="{
                  'correct': userAnswers[qIndex] === question.correctAnswerIndex,
                  'wrong': userAnswers[qIndex] !== question.correctAnswerIndex
                }">
                  {{ question.answers[userAnswers[qIndex]] || 'Нет ответа' }}
                </span>
              </p>
              <p v-if="userAnswers[qIndex] !== question.correctAnswerIndex">
                Правильный ответ: {{ question.answers[question.correctAnswerIndex] }}
              </p>
            </div>
            
            <button @click="resetTest" class="retry-btn">Пройти тест снова</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useCoursesStore } from '@/stores/courses';
  import LoadingSpinner from '@/components/LoadingSpinner.vue';
  import ErrorAlert from '@/components/ErrorAlert.vue';
  
  export default defineComponent({
    name: 'CourseView',
    components: {
      LoadingSpinner,
      ErrorAlert,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const route = useRoute();
      const coursesStore = useCoursesStore();
      const course = ref<any>(null);
      const isLoading = ref(false);
      const error = ref<string | null>(null);
      const userAnswers = ref<number[]>([]);
      const testSubmitted = ref(false);
  
      const fetchCourse = async () => {
        isLoading.value = true;
        error.value = null;
        try {
          const courseId = String(route.params.id || props.id);
          course.value = await coursesStore.fetchCourseById(courseId);
          userAnswers.value = new Array(course.value.testQuestions?.length || 0).fill(-1);
        } catch (err) {
          error.value = 'Не удалось загрузить курс';
          console.error(err);
        } finally {
          isLoading.value = false;
        }
      };
  
      onMounted(fetchCourse);
  
      const correctAnswers = computed(() => {
        if (!course.value || !course.value.testQuestions) return 0;
        return course.value.testQuestions.reduce((acc: number, question: any, index: number) => {
          return acc + (userAnswers.value[index] === question.correctAnswerIndex ? 1 : 0);
        }, 0);
      });
  
      const testPercentage = computed(() => {
        if (!course.value || !course.value.testQuestions || course.value.testQuestions.length === 0) return 0;
        return Math.round((correctAnswers.value / course.value.testQuestions.length) * 100);
      });
  
      const submitTest = () => {
        testSubmitted.value = true;
      };
  
      const resetTest = () => {
        userAnswers.value = new Array(course.value.testQuestions?.length || 0).fill(-1);
        testSubmitted.value = false;
      };
  
      return {
        course,
        isLoading,
        error,
        userAnswers,
        testSubmitted,
        correctAnswers,
        testPercentage,
        fetchCourse,
        submitTest,
        resetTest,
      };
    },
  });
  </script>
  
  <style scoped>
  .course-view {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .back-link {
    display: inline-block;
    margin-bottom: 20px;
    color: #2196f3;
    text-decoration: none;
  }
  
  .back-link:hover {
    text-decoration: underline;
  }
  
  .course-header {
    margin-bottom: 30px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .course-meta {
    display: flex;
    gap: 15px;
    margin-top: 10px;
    color: #666;
  }
  
  .course-meta .category {
    background-color: #e3f2fd;
    padding: 3px 8px;
    border-radius: 12px;
  }
  
  .course-blocks {
    margin-bottom: 40px;
  }
  
  .block {
    margin-bottom: 30px;
  }
  
  .block h3 {
    margin-bottom: 10px;
    color: #333;
  }
  
  .block p {
    line-height: 1.6;
  }
  
  .course-test {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
  }
  
  .test-questions {
    margin-top: 20px;
  }
  
  .question {
    margin-bottom: 25px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 5px;
  }
  
  .option {
    margin: 8px 0;
    display: flex;
    align-items: center;
  }
  
  .option input {
    margin-right: 10px;
  }
  
  .submit-btn,
  .retry-btn {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
  }
  
  .submit-btn:hover,
  .retry-btn:hover {
    background-color: #3e8e41;
  }
  
  .test-results {
    margin-top: 20px;
  }
  
  .result-item {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f5f5f5;
    border-radius: 5px;
  }
  
  .correct {
    color: #4caf50;
    font-weight: bold;
  }
  
  .wrong {
    color: #f44336;
    font-weight: bold;
  }
  </style>