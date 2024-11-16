<template>
  <div class="word-display">
    <p id="question-text">{{ questionText }}</p>

    <p id="answer-text" :style="{ color: isShowingAnswer ? 'black' : 'transparent' }">
      {{ answerText.trad === '' ? 'vide' : answerText.trad }}
    </p>
    <p id="answer-phonetique" :style="{ color: statusAnswersTotal ? 'black' : 'transparent' }">
      {{ !statusAnswersTotal ? 'vide' : answerText.phonetic }}
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
    <div v-if="showIndex" class="ratio">
      {{currentWordIndex}}/{{words.length}}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Button from "~/components/input/Button.vue";
import {filters} from "css-select";
interface Response {
  trad: string,
  phonetic: string,

}
const props = defineProps(['words', 'language', 'isRandom', 'showIndex'])
const NULL_ANSWER_TEXT : Response = { trad: '', phonetic: ''}
const questionText = ref('')
const answerText = ref(NULL_ANSWER_TEXT)
const isShowingAnswer = ref(false)
const hintButtonDisabled = ref(false)
const statusAnswersTotal = ref(false)

const currentWordIndex = ref(0)
const word = computed(() => props.words[currentWordIndex.value])

function nextWord() {
  currentWordIndex.value = props.isRandom ? Math.floor(Math.random() * props.words.length) : (currentWordIndex.value + 1) % props.words.length
  questionText.value = props.language === 'fr' ? word.value.fr : word.value.ar
  answerText.value = {...NULL_ANSWER_TEXT}
  isShowingAnswer.value = false
  hintButtonDisabled.value = false
  statusAnswersTotal.value = false
}

function toggleAnswerOrNextWord() {
  if (!isShowingAnswer.value ||  !statusAnswersTotal.value) {
    answerText.value = props.language === 'fr' ?
      { trad: word.value.ar, phonetic: word.value.phonetic } :
        { trad: word.value.fr, phonetic: word.value.phonetic }
    isShowingAnswer.value = true
    statusAnswersTotal.value = true
  } else {
    nextWord()
  }
}

function showHint() {
  const answer = props.language === 'fr' ? word.value.ar : word.value.fr
  answerText.value.trad = answer.slice(0, answerText.value.trad.length + 1)
  isShowingAnswer.value = true
  if (answerText.value.trad.length >= answer.length) hintButtonDisabled.value = true
}

watch(() => props.language, nextWord, { immediate: true })
watch(() => props.words, nextWord, { immediate: true })
</script>

<style scoped>
.word-display {
  margin: 8px 0;
}
#question-text {
  font-size: 2em;
  margin-bottom: 8px;
}
#answer-text { font-size: 2em }
#answer-phonetique { font-size: 1.8em }
.ratio {
  margin-top: 16px;
}
p {
  margin: 0 16px;
}
</style>
