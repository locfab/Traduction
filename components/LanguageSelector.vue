<template>
  <div>
    <Select
        label="Sélectionnez une langue"
        :options="languages"
        v-model="selectedLanguage"
        id="language-select"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Select from "~/components/input/Select.vue";

// Liste des options à passer dans le Select
const languages = [
  { label: 'Français', value: 'fr' },
  { label: 'Arabe', value: 'ar' }
]
const emits = defineEmits(['updateLanguage'])
// Variable liée au Select (via v-model)
const selectedLanguage = ref('fr')

// Watcher pour surveiller la variable selectedLanguage
watch(selectedLanguage, (newValue, oldValue) => {
  // Émettre l'événement 'updateLanguage' avec la nouvelle valeur
  emits('updateLanguage', selectedLanguage.value)
})
</script>
