<template>
  <div class="error-alert" v-if="message">
    <p>{{ message }}</p>
    <button @click="onRetry" v-if="retry">Повторить</button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ErrorAlert',
  props: {
    message: {
      type: String,
      required: true,
    },
    retry: {
      type: Function,
      default: null,
    },
  },
  methods: {
    onRetry() {
      this.retry?.();
    },
  },
};
</script>

<style scoped>
.error-alert {
  padding: 15px;
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: 4px;
  color: #c62828;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-alert button {
  background-color: #c62828;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}
</style>