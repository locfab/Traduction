<!-- pages/index.vue -->
<template>
  <div class="categories-container">
    <div
        v-for="file in files"
        :class="['category', file === selectedFile ? 'selected' : '']"
        :key="file"
        @click="selectFile(file)">
      <span>{{ file }}</span>
    </div>
  </div>
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

const words = ref<Line[]>([])
const currentLanguage = ref<string>('fr')
const files = ref(["verbes_A-C.csv", "verbes_D-E.csv", "mots.csv"])
const selectedFile = ref<string | null>(null)

function updateLanguage(language: string) {
  currentLanguage.value = language
}

function selectFile(file: string) {
  selectedFile.value = file
  loadCSV()
}

interface Line {
  fr: string, phonetic: string, ar: string
}
async function loadCSV() {
  words.value = []

  // Si aucun fichier n'est sélectionné, charger tous les fichiers
  const filesToLoad = selectedFile.value ? [selectedFile.value] : files.value

  for (const file of filesToLoad) {
    const response = await fetch(file)
    const data = await response.text()
    words.value = [...words.value, ...parseCSV(data)]
  }
}

function parseCSV(data: any) : Line[] {
  return data.trim().split('\n').map((line : string) => {
    const [fr, phonetic, ar] = line.split(';')
    return { fr: fr, phonetic: phonetic, ar: ar }
  })
}

// Charger les fichiers si aucun fichier n'est sélectionné
onMounted(() => {
  if (!selectedFile.value) {
    loadCSV()
  }
})
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
  background-color: #007BFF;
  color: white;
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
