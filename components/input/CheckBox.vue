<!-- components/Checkbox.vue -->
<template>
  <div class="checkbox-group">
    <input
        type="checkbox"
        :id="id"
        v-model="checked"
        :required="required"
        class="checkbox-input"
    />
    <label :for="id" class="checkbox-label">
      <span class="checkbox-custom"></span>
      {{ label }}
    </label>
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
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits();
const checked = ref(props.modelValue);

watch(checked, (newValue) => {
  emit('update:modelValue', newValue);
});
</script>

<style scoped>
.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid #4CAF50;
  border-radius: 4px;
  position: relative;
  display: inline-block;
  margin-right: 8px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.checkbox-input:checked + .checkbox-label .checkbox-custom {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.checkbox-custom::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.checkbox-input:checked + .checkbox-label .checkbox-custom::after {
  opacity: 1;
}
</style>
