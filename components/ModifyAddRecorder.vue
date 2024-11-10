<template>
  <div class="audio-form">
    <form @submit.prevent="handleSubmit">
      <InputText
          id="sourceLanguage"
          label="Langue source"
          v-model="formData.sourceLanguage"
          placeholder="Entrez la langue source"
          required
      />

      <InputText
          id="sourcePhonetic"
          label="Phonétique source"
          v-model="formData.sourcePhonetic"
          placeholder="Entrez la phonétique de la langue source"
          required
      />

      <InputText
          id="targetLanguage"
          label="Langue cible"
          v-model="formData.targetLanguage"
          placeholder="Entrez la langue cible"
          required
      />

      <InputText
          id="targetPhonetic"
          label="Phonétique cible"
          v-model="formData.targetPhonetic"
          placeholder="Entrez la phonétique de la langue cible"
          required
      />

      <AudioRecorder @audio-recorded="handleAudioRecorded" />

      <div v-if="audioUrl" class="audio-preview">
        <label for="audio">Fichier audio :</label>
        <input type="hidden" id="audio" v-model="formData.audioUrl" />
      </div>

      <Button
          text="Envoyer"
          colorClass="primary"
          :disabled="!audioUrl || !formData.sourceLanguage || !formData.sourcePhonetic || !formData.targetLanguage || !formData.targetPhonetic"
          @click="handleSubmit"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AudioRecorder from './AudioRecorder.vue';
import Button from "~/components/input/Button.vue";

// Modèle de données pour le formulaire
const formData = ref({
  sourceLanguage: '',
  sourcePhonetic: '',
  targetLanguage: '',
  targetPhonetic: '',
  audioUrl: '',
});

const audioUrl = ref<string | null>(null);

// Gestion de l'audio enregistré
const handleAudioRecorded = (url: string) => {
  audioUrl.value = url;
  formData.value.audioUrl = url;  // Optionnel si vous voulez synchroniser avec le formulaire
};

// Fonction pour envoyer les données à l'API
const handleSubmit = async () => {
  if (!formData.value.sourceLanguage || !formData.value.sourcePhonetic || !formData.value.targetLanguage || !formData.value.targetPhonetic || !audioUrl.value) {
    alert('Tous les champs doivent être remplis');
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append('sourceLanguage', formData.value.sourceLanguage);
  formDataToSend.append('sourcePhonetic', formData.value.sourcePhonetic);
  formDataToSend.append('targetLanguage', formData.value.targetLanguage);
  formDataToSend.append('targetPhonetic', formData.value.targetPhonetic);

  // Convertir l'URL audio en un fichier Blob
  const audioBlob = await fetch(audioUrl.value as string).then(res => res.blob());
  formDataToSend.append('audio', audioBlob, 'recording.wav');

  try {
    // Envoyer les données à l'API
    const response = await fetch('https://your-api-endpoint.com/upload', {
      method: 'POST',
      body: formDataToSend,
    });

    if (response.ok) {
      alert('Données envoyées avec succès');
      formData.value = { sourceLanguage: '', sourcePhonetic: '', targetLanguage: '', targetPhonetic: '', audioUrl: '' }; // Réinitialiser le formulaire
      audioUrl.value = null; // Réinitialiser l'URL audio
    } else {
      alert('Erreur lors de l\'envoi des données');
    }
  } catch (error) {
    console.error("Erreur d'envoi des données", error);
    alert('Erreur d\'envoi des données');
  }
};
</script>

<style scoped>
.audio-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.audio-preview {
  margin-top: 20px;
  text-align: center;
}

label {
  font-size: 14px;
  color: #555;
}
</style>
