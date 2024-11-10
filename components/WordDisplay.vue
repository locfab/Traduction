<template>
  <div class="word-display">
    <p id="question-text">{{ questionText }}</p>

    <p id="answer-text" :style="{ color: isShowingAnswer ? 'black' : 'transparent' }">
      {{ answerText === '' ? 'vide' : answerText }}
    </p>

    <!-- Utilisation du composant Button -->
    <Button
        :onClick="toggleAnswerOrNextWord"
        :color-class="'primary'"
    >
      {{ statusAnswersTotal ? 'Mot Suivant' : 'Voir la réponse'}}
    </Button>

    <Button
        :onClick="showHint"
        :disabled="hintButtonDisabled"
        :color-class="'secondary'"
    >
      Indice
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Button from "~/components/input/Button.vue";

const props = defineProps(['words', 'language'])
const questionText = ref('')
const answerText = ref('')
const isShowingAnswer = ref(false)
const hintButtonDisabled = ref(false)
const statusAnswersTotal = ref(false)

const currentWordIndex = ref(0)
const word = computed(() => props.words[currentWordIndex.value])

const userAnswer = ref(''); // Variable pour stocker la réponse de l'utilisateur

function nextWord() {
  currentWordIndex.value = Math.floor(Math.random() * props.words.length)
  questionText.value = props.language === 'fr' ? word.value.fr : word.value.ar
  answerText.value = ''
  isShowingAnswer.value = false
  hintButtonDisabled.value = false
  statusAnswersTotal.value = false
  userAnswer.value = ''; // Réinitialiser la réponse de l'utilisateur
}

function toggleAnswerOrNextWord() {
  if (!isShowingAnswer.value ||  !statusAnswersTotal.value) {
    answerText.value = props.language === 'fr'
        ? `${word.value.ar} - ${word.value.phonetic}`
        : `${word.value.fr} - ${word.value.phonetic}`
    isShowingAnswer.value = true
    statusAnswersTotal.value = true
  } else {
    nextWord()
  }
}

function showHint() {
  const answer = props.language === 'fr' ? word.value.ar : word.value.fr
  answerText.value = answer.slice(0, answerText.value.length + 1)
  isShowingAnswer.value = true
  if (answerText.value.length >= answer.length) hintButtonDisabled.value = true
}

watch(() => props.language, nextWord, { immediate: true })
</script>

<style scoped>
.word-display {
  margin: 20px 0;
}
#question-text {
  font-size: 2em;
  margin-bottom: 15px;
}
#answer-text { font-size: 2em }
</style>
