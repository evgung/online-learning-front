<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Вход в систему</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label class="form-label">Имя пользователя</label>
          <input 
            v-model="username" 
            type="text" 
            class="form-input"
            placeholder="Введите ваш логин"
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label">Пароль</label>
          <input 
            v-model="password" 
            type="password" 
            class="form-input"
            placeholder="Введите ваш пароль"
            required
          >
        </div>
        <button type="submit" class="login-button">
          Войти
        </button>
        <p v-if="error" class="error-message">
          {{ error }}
        </p>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const username = ref('')
    const password = ref('')
    const error = ref('')
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogin = async () => {
      try {
        await authStore.login(username.value, password.value)
      } catch (err) {
        error.value = 'Неверное имя пользователя или пароль'
      }
    }

    return { username, password, error, handleLogin }
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 32px;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-2px);
}

.login-title {
  color: #2d3748;
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}

.login-button {
  padding: 12px;
  background-color: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 8px;
}

.login-button:hover {
  background-color: #3182ce;
}

.login-button:active {
  background-color: #2b6cb0;
}

.error-message {
  color: #e53e3e;
  font-size: 14px;
  text-align: center;
  margin-top: 12px;
  padding: 8px;
  background-color: #fff5f5;
  border-radius: 6px;
}
</style>