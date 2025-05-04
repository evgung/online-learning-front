<template>
  <div class="spinner-container">
    <div class="spinner"></div>
    <p>Загрузка...</p>
  </div>
</template>

<script lang="ts">
export default {
  name: 'LoadingSpinner',
};
</script>

<style scoped>
.spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-left-color: #09f;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>