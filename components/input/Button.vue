<!-- components/Button.vue -->
<template>
  <button
      :class="['custom-button', colorClass]"
      :disabled="disabled"
      @click="$emit('click')"
      :type="type"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: 'Click Me',
  },
  colorClass: {
    type: String,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
  },
});

defineEmits(['click']);
</script>

<style scoped>
.custom-button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.custom-button.primary {
  background-color: #4CAF50;
  color: white;
}

.custom-button.secondary {
  background-color: #2196f3;
  color: white;
}

.custom-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
