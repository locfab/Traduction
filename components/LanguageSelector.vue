<!-- components/LanguageSelector.vue -->
<template>
  <div>
    <label for="language-select">Sélectionnez la langue :</label>
    <select id="language-select" v-model="selectedLanguage" @change="changeLanguage">
      <option value="fr">Français</option>
      <option value="ar">Arabe</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref } from 'vue'

const emits = defineEmits(['updateLanguage'])
const selectedLanguage = ref('fr')

function changeLanguage() {
  emits('updateLanguage', selectedLanguage.value)
}
</script>
