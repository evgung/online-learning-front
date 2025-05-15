<template>
  <header class="app-header">
    <h1>Онлайн обучение</h1>
    <button v-if="isAuthenticated" @click="logout" class="logout-btn">Выйти</button>
  </header>
  <main class="app-main">
    <router-view />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'App',
  setup() {
    const authStore = useAuthStore()
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    const logout = () => {
      authStore.logout()
    }

    return { isAuthenticated, logout }
  }
});
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.app-header {
  background-color: #2196f3;
  color: white;
  padding: 20px;
  text-align: center;
}

.app-main {
  padding: 20px;
  min-height: calc(100vh - 80px);
}

.logout-btn {
  padding: 8px 16px;
  background-color: #f56565;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease;
  margin-left: auto;
}

.logout-btn:hover {
  background-color: #e53e3e;
}
</style>