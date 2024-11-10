<template>
  <div class="audio-recorder">
    <!-- Icône Démarrer l'enregistrement -->
    <i
        v-if="!isRecording"
        @click="startRecording"
        class="fas fa-microphone start-icon"
    ></i>

    <!-- Icône Arrêter l'enregistrement -->
    <i
        v-if="isRecording"
        @click="stopRecording"
        class="fas fa-stop stop-icon"
    ></i>

    <!-- Afficher le temps écoulé pendant l'enregistrement -->
    <span v-if="isRecording" class="timer">{{ formattedTime }}</span>

    <!-- Icône Lire l'enregistrement -->
    <i
        v-if="audioUrl"
        @click="playRecording"
        class="fas fa-play play-icon"
    ></i>

    <!-- Élément audio pour lire l'enregistrement -->
    <audio ref="audioElement" :src="audioUrl" @timeupdate="updatePlayTime" v-if="audioUrl"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const isRecording = ref(false);
const audioUrl = ref<string | null>(null);
let mediaRecorder: MediaRecorder | null = null;
const audioChunks: Blob[] = [];
const startTime = ref(0);
const currentTime = ref(0);

// Calculer le temps écoulé formaté pour l'enregistrement
const formattedTime = computed(() => {
  const time = currentTime.value - startTime.value;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

// Fonction pour démarrer l'enregistrement
const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    isRecording.value = true;
    startTime.value = Date.now() / 1000;

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioUrl.value = URL.createObjectURL(audioBlob);
      audioChunks.length = 0;
      isRecording.value = false;
    };
  } catch (error) {
    console.error("Erreur d'accès au microphone :", error);
  }
};

// Fonction pour arrêter l'enregistrement
const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop();
  }
};

// Fonction pour lire l'enregistrement
const playRecording = () => {
  const audioElement = document.createElement('audio');
  audioElement.src = audioUrl.value as string;
  audioElement.play();
};

// Méthode pour suivre l'état de lecture de l'audio
const updatePlayTime = () => {
  const audioElement = document.querySelector('audio') as HTMLAudioElement;
  if (audioElement) {
    currentTime.value = audioElement.currentTime;
  }
};

// Mettre à jour le timer pendant l'enregistrement
let timerInterval: number | null = null;
onMounted(() => {
  timerInterval = setInterval(() => {
    if (isRecording.value) {
      currentTime.value = Date.now() / 1000;
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.audio-recorder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.timer {
  font-size: 1.2rem;
  font-family: monospace;
  margin-top: 10px;
}

i {
  font-size: 50px;
  cursor: pointer;
  transition: transform 0.2s;
}

i:hover {
  transform: scale(1.2); /* Effet de survol pour un effet visuel */
}

.start-icon {
  color: #4caf50; /* Vert pour démarrer */
}

.stop-icon {
  color: #f44336; /* Rouge pour arrêter */
}

.play-icon {
  color: #2196f3; /* Bleu pour lire */
}
</style>
