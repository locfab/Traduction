<template>
  <div class="link-to-add">
    <NuxtLink to="/add">Ajouter un enregistrement</NuxtLink>
  </div>
  <div class="categories-container">
    <div
        v-for="file in files"
        :class="['category', isSelectedFile(file) ? 'selected' : '']"
        :key="file"
        @click="selectFile(file)">
      <span>{{ file }} </span>
    </div>
  </div>
  <div class="random">
    <CheckBox
        id="random"
        label="Aléatoire"
        v-model="isRandom"
    />
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
      <WordDisplay :words="filteredWords" :language="currentLanguage" :isRandom="isRandom" />
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
const files = ref<string[]>(["verbes_A-E.csv", "verbes_F-I.csv", "verbes_J-O.csv", "mots1.csv", "mots2.csv", "mots3.csv", "interrogation.csv", "expressions.csv"]);
const selectedFiles = ref<string[]>([]); // Spread operator to copy the array
const isRandom = ref<boolean>(true);
const search = ref<string>(''); // Variable pour la recherche

// Fonction pour sélectionner un fichier
function selectFile(file: string) {
  selectedFiles.value = isSelectedFile(file) ? selectedFiles.value.filter(sf => sf !== file) : [...selectedFiles.value, file];
  loadCSV();
}

// Fonction pour changer la langue
function updateLanguage(language: string) {
  currentLanguage.value = language;
}

// Fonction pour vérifier si un fichier est sélectionné
function isSelectedFile(file: string): boolean {
  return selectedFiles.value.includes(file);
}

// Interface de structure de ligne
interface Line {
  fr: string;
  phonetic: string;
  ar: string;
}

// Charger les fichiers CSV
async function loadCSV() {
  words.value = [];

  const filesToLoad = selectedFiles.value.length ? selectedFiles.value : files.value;

  for (const file of filesToLoad) {
    const response = await fetch(file);
    const data = await response.text();
    words.value = [...words.value, ...parseCSV(data)];
  }
}

function parseCSV(data: any) : Line[] {
  return data.trim().split('\n').map((line: string) => {
    const [fr, phonetic, ar] = line.trim().split(';');
    return { fr: fr, phonetic: phonetic, ar: ar };
  });
}

const filteredWords = computed(() => {
  return words.value.filter(word => {
    return word.fr.toLowerCase().includes(search.value.toLowerCase()) ||
        word.ar.toLowerCase().includes(search.value.toLowerCase()) ||
        word.phonetic.toLowerCase().includes(search.value.toLowerCase());
  });
});

// Charger les fichiers au montage du composant
onMounted(() => {
  loadCSV();
});

</script>

<style>
/* Conteneur principal */
.container {
  text-align: center;
  width: 100%; /* Utiliser toute la largeur disponible */
  max-width: 500px; /* Limiter la largeur maximale pour ne pas être trop large sur les grands écrans */
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto; /* Centrer horizontalement */
  box-sizing: border-box; /* Assurer que padding ne dépasse pas de la taille spécifiée */
}

.link-to-add {
  text-align: center;
}
.random {
  display: flex;
  justify-content: center;
}

/* Conteneur pour les catégories */
.categories-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center; /* Centrer les catégories horizontalement */
  margin: 20px auto;
  width: 100%;
  max-width: 700px; /* Limiter la largeur du conteneur des catégories */
  box-sizing: border-box;
}

/* Style de chaque catégorie */
.category {
  background-color: #f1f1f1;
  border: 2px solid #ccc;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1 0 30%; /* Chaque catégorie prendra environ 30% de la largeur du conteneur */
  box-sizing: border-box;
}

/* Effet au survol */
.category:hover {
  border: 2px solid #007BFF;
  color: black;
  transform: scale(1.05);
}

/* Effet lors de la sélection */
.category.selected {
  background-color: #ff1493;
  color: white;
  border-color: #ff1493;
}

/* Centrer le texte de chaque catégorie */
.category span {
  display: block;
  text-align: center;
}

/* Responsive Design pour mobile */
@media (max-width: 600px) {
  .container {
    width: 90%; /* Plus large sur les petits écrans */
  }
  .category {
    flex: 1 0 45%; /* Sur les petits écrans, chaque catégorie prendra 45% de la largeur */
  }
}

@media (max-width: 400px) {
  .category {
    flex: 1 0 100%; /* Sur les écrans très petits, chaque catégorie prendra toute la largeur */
  }
}

</style>
