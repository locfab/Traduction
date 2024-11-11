<!-- components/InputText.vue -->
<template>
  <div class="input-group">
    <label :for="id">{{ label }}</label>
    <input
        v-model="inputValue"
        :id="id"
        :placeholder="placeholder"
        :required="required"
        :type="type"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

// Définir les propriétés acceptées par le composant
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

// Lier la valeur d'entrée à une variable locale
const inputValue = ref(props.modelValue);

// Émettre un événement lorsque la valeur change (pour maintenir la liaison v-model)
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});

// Définir l'événement d'émission
const emit = defineEmits();
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-size: 14px;
  color: #555;
}

input {
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
</style>
