<!-- components/Select.vue -->
<template>
  <div class="select-container">
    <label :for="id">{{ label }}</label>
    <select :id="id" v-model="selectedValue" @change="emitChange">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Propriétés du composant
const props = defineProps({
  label: {
    type: String,
    required: true
  },
  options: {
    type: Array as () => { label: string, value: string }[],
    required: true
  },
  id: {
    type: String,
    default: 'select'
  },
  modelValue: {
    type: String,
    default: ''
  }
})

// Définir les événements émis
const emit = defineEmits(['update:modelValue'])

// Valeur sélectionnée
const selectedValue = ref(props.modelValue)

// Quand la sélection change, on émet la valeur sélectionnée
function emitChange() {
  emit('update:modelValue', selectedValue.value)
}
</script>

<style scoped>
.select-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s ease;
}

select:focus {
  border-color: #4CAF50;
}

label {
  font-size: 14px;
  margin-bottom: 5px;
}
</style>
