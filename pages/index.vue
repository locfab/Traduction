<template>
  <div class="link-to-add" v-if="false">
    <NuxtLink to="/add">Ajouter un enregistrement</NuxtLink>
  </div>
  <div class="categories-container">
    <div
        v-for="file in files"
        :class="['category', isSelectedFile(file) ? 'selected' : '']"
        :key="file"
        @click="selectFile(file)">
      <span>{{ formatFileName(file) }} </span>
    </div>
  </div>
  <div class="options">
    <div class="random">
      <CheckBox
          id="random"
          label="Aléatoire"
          v-model="isRandom"
      />
    </div>
    <div class="show-index">
      <CheckBox
          id="show-index"
          label="Stat"
          v-model="showIndex"
      />
    </div>
    <div class="all-visible">
      <CheckBox
          id="all-visible"
          label="All visible"
          v-model="visibleAnswers"
      />
    </div>
    <div class="only-sound">
      <CheckBox
          id="only-sound"
          label="Juste son"
          v-model="onlySound"
      />
    </div>
  </div>
  <div class="container">
    <h1>Apprendre le Darija</h1>
    <LanguageSelector @updateLanguage="updateLanguage" />
    <div class="search-container">
      <InputText
          id="search"
          label="Recherche"
          v-model="search"
          placeholder="Rechercher"
      />
    </div>

    <div v-if="filteredWords.length">
      <WordDisplay
          :words="filteredWords"
          :language="currentLanguage"
          :isRandom="isRandom"
          :showIndex="showIndex"
          :visibleAnswers="visibleAnswers"
          :onlySound="onlySound"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import LanguageSelector from "../components/LanguageSelector.vue";
import WordDisplay from "../components/WordDisplay.vue";
import CheckBox from "~/components/input/CheckBox.vue";

const words = ref<Line[]>([]);
const currentLanguage = ref<string>('fr');
const files = ref<string[]>(["verbA-I.csv", "verbJ-O.csv", "verbP-R.csv", "verbS-T.csv", "mots1.csv", "mots2.csv", "mots3.csv", "mots4.csv", "interrog.csv", "expr.csv", "expr2.csv", "d-m-y.csv", "son.csv"]);
const selectedFiles = ref<string[]>([]);
const isRandom = ref<boolean>(true);
const showIndex = ref<boolean>(false);
const search = ref<string>('');
const visibleAnswers = ref<boolean>(false);
const onlySound = ref<boolean>(false);

function selectFile(file: string) {
  selectedFiles.value = isSelectedFile(file) ? selectedFiles.value.filter(sf => sf !== file) : [...selectedFiles.value, file];
  loadCSV();
}

function updateLanguage(language: string) {
  currentLanguage.value = language;
}

function isSelectedFile(file: string): boolean {
  return selectedFiles.value.includes(file);
}

function formatFileName(file: string): string {
  return file.replace('.csv', '');
}

export interface Line {
  fr: string;
  phonetic: string;
  ar: string;
  sound?: string; // Champ optionnel pour le son
}

async function loadCSV() {
  const tempWords = [];
  const filesToLoad = selectedFiles.value.length ? selectedFiles.value : files.value;

  for (const file of filesToLoad) {
    const response = await fetch(file);
    const data = await response.text();
    tempWords.push(...parseCSV(data));
  }

  words.value = tempWords;
}

function parseCSV(data: any) : Line[] {
  return data.trim().split('\n').map((line: string) => {
    const [fr, phonetic, ar, sound] = line.trim().split(';');  // Ajouter le son ici
    return { fr: fr, phonetic: phonetic, ar: ar, sound: sound || undefined }; // Si aucun son, laisser undefined
  });
  //sound : https://tajinequiparle.com/prononciation-arabe-marocain/consonnes/
}

function normalizeString(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const filteredWords = computed(() => {
  return words.value
      .filter(word => !!word.sound)
      .filter(word => {
        const normalizedSearch = normalizeString(search.value);
        return normalizeString(word.fr).includes(normalizedSearch) ||
            normalizeString(word.ar).includes(normalizedSearch) ||
            normalizeString(word.phonetic).includes(normalizedSearch);
      });
});

onMounted(() => {
  loadCSV();
});
</script>

<style>
.container {
  text-align: center;
  width: 100%;
  max-width: 500px;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  box-sizing: border-box;
}

.link-to-add {
  text-align: center;
}
.options {
  display: flex;
  justify-content: center;
}

.categories-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
  margin: 4px auto;
  width: 100%;
  max-width: 700px;
  box-sizing: border-box;
}

.category {
  background-color: #f1f1f1;
  border: 2px solid #ccc;
  padding: 2px 4px; /* Réduction des marges internes */
  border-radius: 2px;
  font-size: 16px; /* Taille de police réduite */
  font-weight: 700; /* Réduction de l'épaisseur de la police */
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1 0 18%; /* Taille plus petite pour afficher plus de catégories */
  box-sizing: border-box;
}

.category:hover {
  border: 2px solid #007BFF;
  color: black;
  transform: scale(1.05);
}

.category.selected {
  background-color: #ff1493;
  color: white;
  border-color: #ff1493;
}

.category span {
  display: block;
  text-align: center;
}

.show-index {
  margin-left: 8px;
}

.all-visible {
  margin-left: 8px;
}
.only-sound {
  margin-left: 8px;
}

@media (max-width: 400px) {
  .container {
    width: 90%;
  }
  .category {
    flex: 1 0 19%; /* Ajustement pour petits écrans */
  }
}
</style>
