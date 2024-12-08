<template>
  <div class="word-display">
    <p id="question-text">{{ questionText }}</p>

    <p id="answer-text" :style="{ color: isShowingAnswer ? 'black' : 'transparent' }">
      {{ answerText.trad === '' ? 'vide' : answerText.trad }}
    </p>
    <p id="answer-phonetique" :style="{ color: statusAnswersTotal ? 'black' : 'transparent' }">
      {{ !statusAnswersTotal ? 'vide' : answerText.phonetic }}
    </p>

    <div class="buttons">
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

      <span v-if="word.sound" @click="playSound(false)" class="sound">
      <i class="fas fa-volume-up" :style="{ fontSize: '2em', cursor: 'pointer', color: (isPlayed ? 'orange': 'black') }"></i>
    </span>
    </div>
    <div v-if="showIndex" class="ratio">
      {{currentWordIndex}}/{{words.length}}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Button from "~/components/input/Button.vue";

interface Response {
  trad: string,
  phonetic: string,
  sound: string | undefined,
}

const props = defineProps(['words', 'language', 'isRandom', 'showIndex', 'visibleAnswers', 'onlySound'])
const NULL_ANSWER_TEXT : Response = { trad: '', phonetic: '', sound: undefined }
const questionText = ref('')
const answerText = ref(NULL_ANSWER_TEXT)
const isShowingAnswer = ref(props.visibleAnswers)
const statusAnswersTotal = ref(props.visibleAnswers)
const hintButtonDisabled = ref(false)

const currentWordIndex = ref(0)
const word = computed(() => props.words[currentWordIndex.value])
let audio: HTMLAudioElement | null = null
const isPlayed = ref(false)

function playSound(cut=false) {
  if (word.value && word.value.sound) {
    if(!isPlayed.value && !cut){
      audio = new Audio(word.value.sound)
      audio.play()
      isPlayed.value = true
    } else {
      audio?.pause()
      audio = null
      isPlayed.value = false
    }
  }
}


function nextWord() {
  playSound(true)
  currentWordIndex.value = props.isRandom ? Math.floor(Math.random() * props.words.length) : (currentWordIndex.value + 1) % props.words.length
  questionText.value = props.language === 'fr' ? word.value.fr : word.value.ar
  const answer = {trad: props.language === 'fr' ? word.value.ar : word.value.fr, phonetic: word.value.phonetic, sound: word.value.sound}
  answerText.value = props.visibleAnswers ? {...answer } : {...NULL_ANSWER_TEXT}
  isShowingAnswer.value = props.visibleAnswers
  statusAnswersTotal.value = props.visibleAnswers
  hintButtonDisabled.value = false
}

function toggleAnswerOrNextWord() {
  if (!isShowingAnswer.value ||  !statusAnswersTotal.value) {
    answerText.value = props.language === 'fr' ?
        { trad: word.value.ar, phonetic: word.value.phonetic, sound: word.value.sound } :
        { trad: word.value.fr, phonetic: word.value.phonetic, sound: word.value.sound }
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
watch(() => props.visibleAnswers, nextWord, { immediate: true })
watch(() => props.onlySound, nextWord, { immediate: true })
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
.sound{
  margin-left: 4px;
}
.buttons{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
