<template>
  <v-card class="analytics-card">
    <div class="ai-assistant">
      <v-avatar
        image="https://yt3.googleusercontent.com/ytc/AIf8zZTNiXkXpDYBl1MtK3mT3ypGgvMkHHlgLfTaIwNY=s176-c-k-c0x00ffffff-no-rj"
        size="48"
        class="assistant-avatar"
      />
      <div class="message-bubble">
        <div class="assistant-name">SPEED</div>
        <div class="analysis-text">
          {{ currentMessage }}
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const currentMessage = ref('')

// Compute analytics
const analytics = computed(() => {
  const total = props.tasks.length
  const done = props.tasks.filter(t => t.status === 'done').length
  const inProgress = props.tasks.filter(t => t.status === 'inProgress').length
  const highPriority = props.tasks.filter(t => t.priority === 'High').length
  
  return {
    total,
    done,
    inProgress,
    highPriority,
    completionRate: total ? Math.round((done / total) * 100) : 0
  }
})

// Generate different messages based on analytics
const generateMessage = () => {
  const messages = [
    // Angry Speed reactions (when tasks aren't getting done)
    `BRUHHH ${analytics.value.completionRate < 20 ? "YOU ONLY AT ${analytics.value.completionRate}%?! I'M BOUT TO LOSE IT FR FR! 🤬 GET YO LAZY SELF UP! SEWEY!" : 
      "KEEP GRINDIN' YOU ALMOST THERE! 💪"}`,

    `${analytics.value.highPriority > 3 ? 
      "NAHHHH THIS IS ACTUALLY MAKING ME MAD MAD! ${analytics.value.highPriority} HIGH PRIORITY?! DO SOMETHING RN! 🤬" : 
      "AIGHT BET, YOU HANDLING THEM PRIORITIES! SUIIIII! 🐐"}`,

    // Happy/Excited Speed reactions (for good progress)
    `${analytics.value.done > 3 ? 
      "YESSIR! YOU GOING STUPID WITH IT! ${analytics.value.done} TASKS CLEARED! CRISTIANO RONALDO! SEWEYYYY! ⚽️🔥" : 
      "MY GRANDMA WORK FASTER THAN THIS BRO! 💀"}`,

    // Normal Speed reactions (general updates)
    `${analytics.value.inProgress ? 
      `YOU GOT ${analytics.value.inProgress} TASKS IN THE COOKER! THAT'S WHAT I LIKE TO SEE! WHO'S THE BEST?! SPEED! 🏃‍♂️` : 
      "BRO REALLY SITTING HERE DOING NOTHING! I CAN'T WITH YOU! 😭"}`,

    // Classic Speed catchphrases
    `${analytics.value.total === 0 ? 
      "SPEED HERE! AND TODAY... BRO WHERE ARE THE TASKS AT?! ARE YOU SERIOUS RN?! 😤" :
      `${analytics.value.completionRate}% COMPLETE! ${analytics.value.completionRate > 50 ? "SIUUUUUU! 🐐" : "WAKE UP WAKE UP! 😡"}`}`,

    // Speed's competitive spirit
    `${analytics.value.done > 0 ? 
      `${analytics.value.done} TASKS DONE! BUT I COULD DO MORE! I'M BETTER THAN YOU! SPEED THE GOAT! 🐐` : 
      "0 TASKS?! NAH NAH NAH, YOU'RE ACTUALLY SELLING! I'M DONE! 😤"}`,

    // Speed's signature rage
    `${analytics.value.highPriority > 2 && analytics.value.inProgress === 0 ? 
      "BRO IS YOU DUMB?! HIGH PRIORITY TASKS SITTING THERE! I'M ACTUALLY GETTING TIGHT! 🤬" : 
      "YOU MOVING LIKE A REAL CHAMPION! SIUUUUUU! ⚽️"}`,

    // Speed's motivational mode
    `SPEED HERE! ${analytics.value.completionRate < 40 ? 
      "YOU MAKING ME LOOK BAD RN! DO BETTER! 😠" : 
      "YOU'RE HIM! YOU'RE ACTUALLY HIM! 🔥"}`,

    // Speed's celebration style
    `${analytics.value.done === analytics.value.total && analytics.value.total > 0 ? 
      "SUIIIII! ALL TASKS CLEARED! CRISTIANO RONALDO! SEWEYYYY! 🐐⚽️" : 
      "WHY YOU NOT FINISHED YET?! YOU PLAYING WITH ME FR! 😤"}`
  ]
  
  return messages[Math.floor(Math.random() * messages.length)]
}

// Update message every 10 seconds
let messageInterval
onMounted(() => {
  currentMessage.value = generateMessage()
  messageInterval = setInterval(() => {
    currentMessage.value = generateMessage()
  }, 10000)
})

onUnmounted(() => {
  clearInterval(messageInterval)
})

// Update message when tasks change
watch(() => props.tasks, () => {
  currentMessage.value = generateMessage()
}, { deep: true })
</script>

<style lang="scss" scoped>
.analytics-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(99, 102, 241, 0.1);
  margin-bottom: 16px;
}

.ai-assistant {
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.assistant-avatar {
  border: 2px solid rgba(99, 102, 241, 0.2);
  background: white;
}

.message-bubble {
  flex: 1;
  background: linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05));
  border-radius: 12px;
  padding: 12px;
}

.assistant-name {
  font-size: 14px;
  font-weight: 800;
  color: #ef4444;
  margin-bottom: 4px;
  text-transform: uppercase;
}

.analysis-text {
  font-size: 14px;
  line-height: 1.4;
  color: #4b5563;
}
</style> 