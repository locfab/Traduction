<!-- pages/index.vue -->
<template>
  <div class="container">
    <h1>Apprendre le Darija</h1>
    <LanguageSelector @updateLanguage="updateLanguage" />
    <div v-if="words.length" >
      <WordDisplay :words="words" :language="currentLanguage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LanguageSelector from "../components/LanguageSelector.vue";
import WordDisplay from "../components/WordDisplay.vue";


const words = ref([])
const currentLanguage = ref('fr')

function updateLanguage(language) {
  currentLanguage.value = language
}

async function loadCSV() {
  const response = await fetch('/verbes_darija.csv')
  const data = await response.text()
  words.value = parseCSV(data)
}

function parseCSV(data) {
  return data.trim().split('\n').slice(1).map(line => {
    const [fr, phonetic, ar] = line.split(',')
    return { fr: fr.trim(), phonetic: phonetic.trim(), ar: ar.trim() }
  })
}

onMounted(loadCSV)
</script>

<style>
.container {
  text-align: center;
  width: 80%;
  max-width: 500px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
