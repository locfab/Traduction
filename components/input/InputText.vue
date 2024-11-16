<template>
  <div class="input-group">
    <label :for="id">{{ label }}</label>
    <div class="input-wrapper">
      <input
          v-model="inputValue"
          :id="id"
          :placeholder="placeholder"
          :required="required"
          :type="type"
      />
      <button
          v-if="inputValue"
          type="button"
          class="clear-button"
          @click="clearInput"
          aria-label="Effacer la valeur"
      >
        &times;
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'text',
  },
});

const inputValue = ref(props.modelValue);

watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});

const emit = defineEmits();

const clearInput = () => {
  inputValue.value = '';
  emit('update:modelValue', '');
};
</script>


<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #4CAF50;
}

.clear-button {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: #888;
  cursor: pointer;
  line-height: 1;
}

.clear-button:hover {
  color: #555;
}
</style>
