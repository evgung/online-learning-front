<template>
  <header class="app-header">
    <h1>Онлайн обучение</h1>
  </header>
  <main class="app-main">
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
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
</style>