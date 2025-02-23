<template>
  <v-card class="analytics-card">
    <div class="ai-assistant">
      <v-avatar
        :image="currentAvatar"
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

// Avatar URLs for different moods
const avatars = {
  angry: "https://image-cdn.essentiallysports.com/wp-content/uploads/IShowSpeed-4-640x640.png",
  happy: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRscA_F7YdntUrC2Dkc-kE845pkKkZZT6tnrA&s",
  normal: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/07ed52f9-65de-4d91-afc1-6d9594f0de81/dgrlexe-c422f5f4-26f5-4cce-a070-13bfb07b4638.png/v1/fill/w_1044,h_766,q_70,strp/i_show_speed__1_by_mrorlandomagicfan200_dgrlexe-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTE0IiwicGF0aCI6IlwvZlwvMDdlZDUyZjktNjVkZS00ZDkxLWFmYzEtNmQ5NTk0ZjBkZTgxXC9kZ3JsZXhlLWM0MjJmNWY0LTI2ZjUtNGNjZS1hMDcwLTEzYmZiMDdiNDYzOC5wbmciLCJ3aWR0aCI6Ijw9MTI0NiJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.GBdiBzg385vvRL0tYuF_tzoJ62uLdbom2kMvw_AFPNE",
  sad: "https://www.indiatimes.com/entertainment/bollywood/american-youtuber-ishowspeed-reacts-to-jawans-trailer-calls-it-new-avengers-movie-609009.html"
}

// Determine avatar based on analytics
const currentAvatar = computed(() => {
  const { completionRate, highPriority, total, done } = analytics.value
  
  // Show angry Speed when things are bad
  if (completionRate < 30 || (highPriority > 2 && analytics.value.inProgress === 0)) {
    return avatars.angry
  }
  
  // Show sad Speed when no progress or no tasks
  if (total === 0 || done === 0) {
    return avatars.sad
  }
  
  // Show happy Speed for good progress
  if (completionRate > 70 || analytics.value.done === total) {
    return avatars.happy
  }
  
  // Default to normal Speed
  return avatars.normal
})

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
      "WHY YOU NOT FINISHED YET?! YOU PLAYING WITH ME FR! 😤"}`,

    // Add new sad Speed reactions
    `${analytics.value.done === 0 ? 
      "bro... i'm actually sad rn... not a single task done? 😢 you making speed cry fr fr..." : 
      "KEEP THAT GRIND UP! DON'T MAKE ME SAD AGAIN! 💪"}`,

    `${analytics.value.total === 0 ? 
      "my disappointment is immeasurable... and my day is ruined... WHERE THE TASKS AT?! 😭" : 
      "AT LEAST YOU GOT SOME TASKS! NOW DO THEM! 😤"}`,

    `${analytics.value.highPriority > 0 && analytics.value.inProgress === 0 ? 
      "you see these priority tasks and doing nothing... why you doing this to me bro... 😢" : 
      "THAT'S MORE LIKE IT! KEEP WORKING! 🔥"}`
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
  transition: all 0.3s ease; // Smooth transition between avatars
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