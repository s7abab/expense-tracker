<template>
  <div class="speed-assistant">
    <v-slide-x-transition>
      <div v-show="isVisible" class="speed-content">
        <!-- Speech Bubble -->
        <div class="speech-bubble">
          <div class="assistant-name">SPEED</div>
          <div class="analysis-text">
            {{ currentMessage }}
          </div>
        </div>
        
        <!-- Speed Avatar -->
        <div class="avatar-container">
          <v-avatar
            :image="currentAvatar"
            size="120"
            class="speed-avatar"
          />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            class="close-btn"
            color="error"
            @click="hideAssistant"
          />
        </div>
      </div>
    </v-slide-x-transition>
    
    <!-- Toggle button -->
    <v-btn
      v-show="!isVisible"
      color="error"
      class="toggle-btn"
      elevation="4"
      size="large"
      height="60"
      @click="showAssistant"
    >
      <v-avatar :image="currentAvatar" size="42" class="toggle-avatar" />
      <span class="ml-2">ASK SPEED</span>
    </v-btn>
  </div>
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
const isVisible = ref(true)

// Avatar URLs for different moods
const avatars = {
  angry: "https://media.tenor.com/g9j6VtTvQf4AAAAM/speed.gif",
  'very_angry':"https://gifdb.com/images/high/ishowspeed-showing-teeth-while-looking-d0b1xsvxqm9fnz30.gif",
  happy: "https://gifdb.com/images/high/ishowspeed-gif-file-8403kb-e1xcdhsa8snp5fhy.gif",
  normal: "https://gifdb.com/images/high/ishowspeed-gif-file-3836kb-19jubjr1fmw8s2cc.gif",
  sad: "https://www.indiatimes.com/entertainment/bollywood/american-youtuber-ishowspeed-reacts-to-jawans-trailer-calls-it-new-avengers-movie-609009.html",
  surprised: "https://media0.giphy.com/media/lxxOGaDRk4f7R5TkBd/200w.gif?cid=6c09b952p8wg2l73ceh9qdnajr9n3yrzievbpufjlmo6fnqz&ep=v1_gifs_search&rid=200w.gif&ct=g",
  "sui":"https://media.tenor.com/vgQ373N5YtsAAAAM/speed-ishowspeed.gif"
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
    // Angry Speed reactions
    `${analytics.value.completionRate < 30 ? 
      "BRO YOU'RE ACTUALLY TRASH! 💀 MY DEAD HAMSTER WORKS HARDER THAN YOU FR FR! GET YO STUPID SELF MOVING! 🤬" : 
      "AYOO YOU STILL SLACKING! SPEED AIN'T PLAYING NO MORE! 😤"}`,

    // Very angry Speed reactions
    `${analytics.value.highPriority > 3 ? 
      "NAH FR THIS TIME I'M BOUT TO THROW HANDS! 👊 ${analytics.value.highPriority} HIGH PRIORITY?! YOU'RE ACTUALLY BRAIN DEAD! 💀" :
      "YOU LUCKY I'M IN A GOOD MOOD OR I'D BE THROWING CHAIRS RN! 🪑"}`,

    // Happy/Crackhead Speed energy
    `${analytics.value.done > analytics.value.total * 0.8 ? 
      "YESSSIRRR! YOU FINALLY USING THAT SMOOTH BRAIN! SPEED IS GEEKED UP! 🔥 LETS GOOO!" : 
      "NAH YOU MOVING SLOWER THAN MY INTERNET ON STREAM! WAKE UP! 😭"}`,

    // Sad/Depressed Speed
    `${analytics.value.done === 0 ? 
      "bro... this ain't it... you making speed more depressed than when he lost to KSI... 😢" : 
      "speed was gonna end it all but you actually did something... 💀"}`,

    // Normal/Unhinged Speed
    `${analytics.value.inProgress ? 
      "SPEED IS WATCHING YOU! DON'T MAKE ME ACT UP! I'M ACTUALLY INSANE! 🤪" : 
      "BRO REALLY DOING NOTHING! YOU DUMBER THAN ME IN MATH CLASS! 📚"}`,

    // SUI Mode Speed
    `${analytics.value.completionRate > 90 ? 
      "SIUUUUUU! YOU ACTUALLY NOT USELESS! RONALDO WOULD STILL BENCH YOU THO! ⚽️" : 
      "NOT EVEN MESSI PLAYS THIS BAD! GET YOUR LIFE TOGETHER! 💀"}`,

    // Surprised Speed
    `${analytics.value.done > 5 ? 
      "YOOO! WHO'S CONTROLLING YOU?! YOU USUALLY DUMBER THAN A BAG OF ROCKS! 🪨" : 
      "BRO WHAT?! MY GOLDFISH GOT MORE WORK ETHIC! 🐠"}`,

    // Angry Speed reactions (when tasks aren't getting done)
    `BRUHHH ${analytics.value.completionRate < 20 ? 
      `YOU ONLY AT ${analytics.value.completionRate}%?! I'M BOUT TO LOSE IT FR FR! 🤬 GET YO LAZY SELF UP! SEWEY!` : 
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
      "THAT'S MORE LIKE IT! KEEP WORKING! 🔥"}`,

    // Very angry when high priority tasks pile up
    `${analytics.value.highPriority > 5 ? 
      "BRO I'M ACTUALLY BOUT TO LOSE IT! ${analytics.value.highPriority} HIGH PRIORITY?! *SPEED RAGE MODE* 🤬🔥" : 
      "KEEP THEM PRIORITIES IN CHECK! YOU DON'T WANT TO SEE ME MAD! 😤"}`,

    // Surprised at quick progress
    `${analytics.value.done > analytics.value.total * 0.5 && analytics.value.inProgress > 2 ? 
      "HOLD UP! YOU MOVING TOO FAST! SPEED CAN'T EVEN KEEP UP! 😱🏃‍♂️" : 
      "WHY CAN'T YOU MOVE THIS FAST ALL THE TIME?! 🤔"}`,

    // SUI celebration for completed tasks
    `${analytics.value.done === analytics.value.total ? 
      "SIUUUUUUU! SIUUUUUUU! DOUBLE SIUUUUUUU! 🐐⚽️🐐 SPEED AND CR7 PROUD OF YOU!" : 
      "NOT ENOUGH SIUUU ENERGY! NEED MORE COMPLETED TASKS! ⚽️"}`
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

const hideAssistant = () => {
  isVisible.value = false
}

const showAssistant = () => {
  isVisible.value = true
  currentMessage.value = generateMessage() // Generate new message when showing
}
</script>

<style lang="scss" scoped>
.speed-assistant {
  position: fixed;
  right: 24px;
  top: 24px;
  z-index: 100;
}

.speed-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  width: 320px;
}

.speech-bubble {
  position: relative;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(239, 68, 68, 0.2);
  border-radius: 20px;
  padding: 16px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
  
  // Speech bubble triangle
  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    right: 60px;
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid rgba(255, 255, 255, 0.98);
  }
  
  &:before {
    content: '';
    position: absolute;
    bottom: -14px;
    right: 58px;
    width: 0;
    height: 0;
    border-left: 14px solid transparent;
    border-right: 14px solid transparent;
    border-top: 14px solid rgba(239, 68, 68, 0.2);
    z-index: -1;
  }
}

.avatar-container {
  position: relative;
  margin-right: 24px;
}

.speed-avatar {
  border: 3px solid #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
  }
}

.close-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: white !important;
  border: 2px solid #ef4444 !important;
  opacity: 0.9;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
}

.toggle-btn {
  border-radius: 16px;
  padding: 8px 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  border: 2px solid rgba(239, 68, 68, 0.2);
  
  &:hover {
    .toggle-avatar {
      transform: scale(1.1);
    }
  }
}

.toggle-avatar {
  transition: transform 0.2s ease;
}

.assistant-name {
  font-size: 18px;
  font-weight: 800;
  color: #ef4444;
  margin-bottom: 8px;
  text-transform: uppercase;
  text-align: center;
}

.analysis-text {
  font-size: 16px;
  line-height: 1.5;
  color: #4b5563;
  text-align: center;
  font-weight: 500;
}

@media (max-width: 768px) {
  .speed-assistant {
    right: 16px;
    top: 16px;
  }

  .speed-content {
    width: 300px;
  }

  .toggle-btn {
    padding: 6px 16px;
    
    .v-avatar {
      size: 36px;
    }
  }
}
</style> 