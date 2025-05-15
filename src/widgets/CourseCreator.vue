<template>
    <div class="course-creator">
      <button @click="toggleCreator" class="toggle-btn">
        {{ isOpen ? 'Закрыть редактор' : 'Создать новый курс' }}
      </button>
  
      <div v-if="isOpen" class="creator-container">
        <h3>Создание нового курса</h3>
  
        <div class="form-group">
          <label>Название курса:</label>
          <input v-model="newCourse.title" type="text" placeholder="Введите название" />
        </div>
  
        <div class="form-group">
          <label>Тематика:</label>
          <select v-model="newCourse.category">
            <option value="Программирование">Программирование</option>
            <option value="Дизайн">Дизайн</option>
            <option value="Маркетинг">Маркетинг</option>
            <option value="Бизнес">Бизнес</option>
          </select>
        </div>
  
        <div class="form-group">
          <label>Время чтения (мин):</label>
          <input v-model.number="newCourse.readingTime" type="number" min="1" />
        </div>
  
        <div class="sections">
          <h4>Текстовые блоки:</h4>
          <div v-for="(block, index) in newCourse.textBlocks" :key="index" class="block-item">
            <input v-model="block.title" placeholder="Заголовок блока" />
            <textarea v-model="block.content" placeholder="Содержание блока"></textarea>
            <button @click="removeBlock(index)" class="remove-btn">Удалить</button>
          </div>
          <button @click="addBlock" class="add-btn">Добавить блок</button>
        </div>
  
        <div class="test-section" v-if="hasTest">
          <h4>Тест:</h4>
          <div v-for="(question, qIndex) in newCourse.testQuestions" :key="'q' + qIndex" class="question-item">
            <input v-model="question.question" placeholder="Вопрос" />
            <div v-for="(option, oIndex) in question.answers" :key="'o' + oIndex" class="option-item">
              <input v-model="question.answers[oIndex]" placeholder="Вариант ответа" />
              <input
                type="radio"
                :name="'correct' + qIndex"
                :checked="question.correctAnswerIndex === oIndex"
                @change="question.correctAnswerIndex = oIndex"
              />
              <label>Правильный ответ</label>
            </div>
            <button @click="addOption(qIndex)" class="small-btn">+ Вариант</button>
            <button @click="removeQuestion(qIndex)" class="remove-btn">Удалить вопрос</button>
          </div>
          <button @click="addQuestion" class="add-btn">Добавить вопрос</button>
        </div>
  
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="hasTest" />
            Добавить тест
          </label>
        </div>
  
        <div class="actions">
          <button @click="saveCourse" :disabled="isSaving" class="save-btn">
            {{ isSaving ? 'Сохранение...' : 'Сохранить курс' }}
          </button>
          <button @click="resetCreator" class="cancel-btn">Отмена</button>
        </div>
  
        <ErrorAlert v-if="error" :message="error" :retry="saveCourse" />
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useCoursesStore } from '@/stores/courses';
  import ErrorAlert from '@/components/ErrorAlert.vue';
  
  export default defineComponent({
    name: 'CourseCreator',
    components: {
      ErrorAlert,
    },
    setup() {
      const coursesStore = useCoursesStore();
      const isOpen = ref(false);
      const hasTest = ref(false);
      const isSaving = ref(false);
      const error = ref<string | null>(null);
  
      const newCourse = ref({
        title: '',
        category: 'Программирование',
        readingTime: 10,
        textBlocks: [] as Array<{ title: string; content: string }>,
        testQuestions: [] as Array<{
          question: string;
          answers: string[];
          correctAnswerIndex: number;
        }>,
      });
  
      const toggleCreator = () => {
        isOpen.value = !isOpen.value;
        if (!isOpen.value) {
          resetCreator();
        }
      };
  
      const addBlock = () => {
        newCourse.value.textBlocks.push({ title: '', content: '' });
      };
  
      const removeBlock = (index: number) => {
        newCourse.value.textBlocks.splice(index, 1);
      };
  
      const addQuestion = () => {
        newCourse.value.testQuestions.push({
          question: '',
          answers: ['', ''],
          correctAnswerIndex: 0,
        });
      };
  
      const addOption = (qIndex: number) => {
        newCourse.value.testQuestions[qIndex].answers.push('');
      };
  
      const removeQuestion = (index: number) => {
        newCourse.value.testQuestions.splice(index, 1);
      };
  
      const resetCreator = () => {
        newCourse.value = {
          title: '',
          category: 'Программирование',
          readingTime: 10,
          textBlocks: [],
          testQuestions: [],
        };
        hasTest.value = false;
        error.value = null;
      };
  
      const saveCourse = async () => {
        if (!newCourse.value.title.trim()) {
          error.value = 'Введите название курса';
          return;
        }
  
        if (newCourse.value.textBlocks.length === 0) {
          error.value = 'Добавьте хотя бы один текстовый блок';
          return;
        }
  
        const courseData = {
          ...newCourse.value,
          hasTest: hasTest.value && newCourse.value.testQuestions.length > 0,
          test: hasTest.value ? newCourse.value.testQuestions : [],
        };
  
        isSaving.value = true;
        error.value = null;
  
        try {
          await coursesStore.addCourse(courseData);
          resetCreator();
          isOpen.value = false;
        } catch (err) {
          error.value = 'Ошибка при сохранении курса';
          console.error(err);
        } finally {
          isSaving.value = false;
        }
      };
  
      return {
        isOpen,
        hasTest,
        isSaving,
        error,
        newCourse,
        toggleCreator,
        addBlock,
        removeBlock,
        addQuestion,
        addOption,
        removeQuestion,
        resetCreator,
        saveCourse,
      };
    },
  });
  </script>
  
  <style scoped>
  .course-creator {
    margin: 20px 0;
  }
  
  .toggle-btn {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1em;
  }
  
  .toggle-btn:hover {
    background-color: #3e8e41;
  }
  
  .creator-container {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-top: 10px;
    background-color: #f9f9f9;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input[type='text'],
  .form-group input[type='number'],
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .sections,
  .test-section {
    margin: 20px 0;
    padding: 15px;
    background-color: white;
    border-radius: 4px;
    border: 1px solid #eee;
  }
  
  .block-item,
  .question-item {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .block-item textarea {
    width: 100%;
    min-height: 100px;
    margin-top: 5px;
  }
  
  .option-item {
    display: flex;
    align-items: center;
    margin: 5px 0;
  }
  
  .option-item input[type='text'] {
    flex-grow: 1;
    margin-right: 10px;
  }
  
  .add-btn,
  .remove-btn,
  .small-btn {
    padding: 5px 10px;
    margin-right: 5px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 0.9em;
  }
  
  .add-btn {
    background-color: #2196f3;
    color: white;
  }
  
  .remove-btn {
    background-color: #f44336;
    color: white;
  }
  
  .small-btn {
    background-color: #ff9800;
    color: white;
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .save-btn {
    background-color: #4caf50;
    color: white;
    padding: 10px 15px;
  }
  
  .cancel-btn {
    background-color: #f44336;
    color: white;
    padding: 10px 15px;
  }
  
  .save-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  </style>