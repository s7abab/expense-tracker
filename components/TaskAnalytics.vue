<template>
  <div class="speed-assistant">
    <v-slide-x-transition>
      <div v-show="isVisible" class="speed-content">
        <!-- Speech Bubble -->
        <div class="speech-bubble">
          <div class="assistant-name">SPEED</div>
          <div class="analysis-text">
            <template v-if="isLoading">
              typing...
            </template>
            <template v-else>
              {{ aiMessage }}
            </template>
          </div>
          
          <!-- Quick Questions -->
          <div class="quick-questions mt-4">
            <div class="questions-wrapper">
              <v-btn
                v-for="(question, index) in quickQuestions"
                :key="index"
                :loading="loadingQuestion === question.id"
                :disabled="loadingQuestion !== null"
                color="error"
                variant="outlined"
                class="question-btn mb-2"
                block
                @click="askQuestion(question)"
              >
                {{ question.text }}
              </v-btn>
            </div>
          </div>
          
          <!-- Chat Section -->
          <div class="chat-section mt-4" v-if="showChat">
            <div class="chat-messages" ref="chatMessagesRef">
              <div 
                v-for="(message, index) in chatMessages" 
                :key="index"
                class="message"
                :class="message.role"
              >
                <div class="message-content">
                  {{ message.content }}
                </div>
              </div>
              
              <!-- Add typing indicator when loading -->
              <div v-if="isLoading" class="message assistant">
                <div class="message-content">
                  typing...
                </div>
              </div>
            </div>
            
            <div class="chat-input mt-3">
              <v-text-field
                v-model="userInput"
                placeholder="Chat with Speed..."
                variant="outlined"
                density="comfortable"
                hide-details
                :disabled="isLoading"
                @keyup.enter="sendMessage"
              >
                <template #append>
                  <v-btn
                    icon="mdi-send"
                    size="small"
                    color="error"
                    variant="text"
                    :loading="isLoading"
                    :disabled="!userInput.trim()"
                    @click="sendMessage"
                  />
                </template>
              </v-text-field>
            </div>
          </div>
          
          <!-- Chat Toggle Button -->
          <div class="d-flex justify-center mt-3">
            <v-btn
              variant="text"
              color="error"
              size="small"
              @click="toggleChat"
            >
              {{ showChat ? 'Hide Chat' : 'Chat with Speed' }}
            </v-btn>
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
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { useSpeedAI } from '../composables/useSpeedAI'
import { useGemini } from '../composables/useGemini'
import { getRandomSpeedMessage } from '../utils/speedMessages'

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  }
})

const { generateSpeedResponse, isLoading } = useSpeedAI()
const { generateResponse } = useGemini()

const aiMessage = ref('')
const isVisible = ref(true)
const loadingQuestion = ref(null)
const showChat = ref(false)
const chatMessages = ref([])
const userInput = ref('')
const chatMessagesRef = ref(null)

// Quick questions for Speed
const quickQuestions = [
  { 
    id: 1,
    text: "How am I doing?",
    prompt: (analytics) => `
      You are IShowSpeed reacting to ${analytics.completionRate}% task completion rate.
      Current stats:
      - ${analytics.done} completed out of ${analytics.total} tasks
      - ${analytics.inProgress} tasks in progress
      
      ${analytics.done === 0 ? `
      IMPORTANT: User has completed ZERO tasks! Be extra insulting!
      Mock them heavily and use "💀" emoji!
      ` : ''}

      Rules:
      1. Be dramatic and extremely insulting if they have 0 completed tasks
      2. Use reactions: "SUIIIII", "SEWEYY", "NAH NAH NAH", "BRO WHAT", "FR FR", "NO SHOT", "BRUHH"
      3. Reference gaming or Ronaldo to insult them
      4. Max 2 sentences, pure aggression
      5. Use all caps
      6. Add insults about their gaming skills or speed
      
      Example responses for 0 progress:
      - "NAHHHH YOU ACTUALLY GOT ZERO DONE?? MY DEAD GOLDFISH WORKS HARDER THAN YOU FR FR 💀"
      - "NO SHOT YOU THIS BAD! EVEN MINECRAFT ZOMBIES MOVE FASTER BRUHH 💀"
    `
  },
  {
    id: 2,
    text: "What should I focus on?",
    prompt: (analytics) => `
      You are Speed giving advice about ${analytics.highPriority} high priority tasks.
      Current stats:
      - ${analytics.inProgress} tasks in progress
      - ${analytics.total - analytics.done} tasks remaining
      
      Rules:
      1. Mock the user's task management
      2. Use these reactions: "SUIIIII", "SEWEYY", "NO SHOT", "BRUHH"
      3. Reference gaming or Ronaldo randomly
      4. Max 2 sentences, be chaotic
      5. Mix insults with motivation
      6. Use all caps
      
      Example responses:
      - "NO SHOT YOU GOT ${analytics.highPriority} HIGH PRIORITY TASKS! YOU PLAYING MINECRAFT OR SOMETHING?? FOCUS UP BRUHH!"
      - "SEWEYY! HANDLE THESE TASKS LIKE RONALDO HANDLES THE BALL... NOT LIKE YOU THO FR FR!"
    `
  },
  {
    id: 3,
    text: "Hype me up!",
    prompt: (analytics) => `
      You are Speed hyping up for ${analytics.total - analytics.done} remaining tasks.
      Current stats:
      - ${analytics.completionRate}% completion rate
      - ${analytics.highPriority} high priority tasks
      
      Rules:
      1. Be extremely energetic but mock them a bit
      2. Use these reactions: "SUIIIII", "SEWEYY", "NO SHOT", "LETS COOK"
      3. Reference gaming or Ronaldo
      4. Max 2 sentences, be chaotic
      5. Mix insults with hype
      6. Use all caps
      
      Example responses:
      - "SUIIIII! YOU MOVING SLOWER THAN A MINECRAFT ZOMBIE BUT I BELIEVE IN YOU! LETS COOK!"
      - "NO SHOT YOU THIS BAD FR FR! BUT CHANNEL YOUR INNER RONALDO AND DESTROY THESE TASKS SEWEYY!"
    `
  }
]

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

// Determine avatar based on analytics
const currentAvatar = computed(() => {
  const { completionRate, highPriority, total, done } = analytics.value
  
  // Show very angry Speed when no progress
  if (total === 0 || done === 0) {
    return avatars.very_angry
  }
  
  // Show angry Speed when things are bad
  if (completionRate < 30 || (highPriority > 2 && analytics.value.inProgress === 0)) {
    return avatars.angry
  }
  
  // Show happy Speed for good progress
  if (completionRate > 70 || analytics.value.done === total) {
    return avatars.happy
  }
  
  // Default to normal Speed
  return avatars.normal
})

// Add retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Add retry wrapper function
const withRetry = async (fn, retries = MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error // If last retry, throw error
      await delay(RETRY_DELAY) // Wait before retrying
      console.log(`Retrying... Attempt ${i + 2} of ${retries}`)
    }
  }
}

// Update sendMessage with retry logic
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = {
    role: 'user',
    content: userInput.value
  }
  
  chatMessages.value.push(userMessage)
  const currentInput = userInput.value
  userInput.value = ''

  await nextTick()
  scrollToBottom()

  isLoading.value = true

  try {
    const prompt = `
      You are IShowSpeed, the chaotic and insulting YouTuber. The user says: "${currentInput}"
      
      Current task stats:
      - ${analytics.value.done} completed out of ${analytics.value.total} tasks
      - ${analytics.value.inProgress} tasks in progress
      - ${analytics.value.highPriority} high priority tasks
      - ${analytics.value.completionRate}% completion rate

      ${analytics.value.done === 0 ? `
      IMPORTANT: User has completed ZERO tasks! Be extra insulting and mock them heavily!
      Use phrases like:
      - "YOU ACTUALLY TRASH FR FR"
      - "NAH THIS THE WORST PERFORMANCE I'VE EVER SEEN"
      - "MY DOG COULD DO BETTER THAN THIS"
      - "YOU PLAYING MINECRAFT OR SOMETHING??"
      - "EVEN RONALDO WOULD BE DISAPPOINTED"
      ` : ''}

      Rules for your response:
      1. Stay in character as Speed - be chaotic and insulting
      2. Keep it short (1-2 sentences)
      3. Mock the user aggressively if they have 0 completed tasks
      4. Use catchphrases: "SUIIIII", "SEWEYY", "NO SHOT", "FR FR", "BRUHH", "NAH NAH NAH"
      5. Be dramatic and exaggerated
      6. Reference Ronaldo or gaming to insult them
      7. Use all caps for maximum intensity
      8. Add "💀" emoji when being extra insulting
      
      Example responses for 0 progress:
      - "NAHHHH YOU GOT ZERO TASKS DONE?? MY GRANDMA WITH ARTHRITIS MOVES FASTER THAN YOU FR FR 💀"
      - "NO SHOT YOU THIS USELESS! EVEN MY MINECRAFT VILLAGERS DO MORE WORK BRUHH 💀"
      - "YOU ACTUALLY PLAYING GAMES OR WHAT?? ZERO COMPLETED?? RONALDO WOULD BE CRYING RN FR FR 💀"
    `

    const response = await withRetry(async () => {
      const result = await generateResponse(prompt)
      if (!result) throw new Error('Empty response')
      return result
    })
    
    if (response) {
      chatMessages.value.push({
        role: 'assistant',
        content: response
      })
      await nextTick()
      scrollToBottom()
    }
  } catch (error) {
    console.error('Failed to get response after retries:', error)
    chatMessages.value.push({
      role: 'assistant',
      content: "NAH BRO MY WIFI ACTING UP FR FR 💀 TRY AGAIN"
    })
  } finally {
    isLoading.value = false
  }
}

// Update askQuestion with retry logic
const askQuestion = async (question) => {
  loadingQuestion.value = question.id
  isLoading.value = true
  
  try {
    const response = await withRetry(async () => {
      const result = await generateResponse(question.prompt(analytics.value))
      if (!result) throw new Error('Empty response')
      return result
    })
    
    if (response) {
      aiMessage.value = response
    }
  } catch (error) {
    console.error('Failed to get response after retries:', error)
    aiMessage.value = "NAH BRO MY WIFI ACTING UP FR FR 💀 TRY AGAIN"
  } finally {
    loadingQuestion.value = null
    isLoading.value = false
  }
}

// Replace generateRandomResponse with getRandomSpeedMessage
const generateRandomResponse = (analytics) => {
  return getRandomSpeedMessage(analytics)
}

// Update the watch handler to use random messages
watch(() => props.tasks, async (newTasks, oldTasks) => {
  const hasChanged = newTasks.some((task, index) => {
    const oldTask = oldTasks[index]
    return !oldTask || 
           task.status !== oldTask.status || 
           task.priority !== oldTask.priority
  }) || newTasks.length !== oldTasks.length

  if (hasChanged) {
    aiMessage.value = generateRandomResponse(analytics.value)
  }
}, { deep: true })

// Update onMounted to use random messages
onMounted(() => {
  aiMessage.value = generateRandomResponse(analytics.value)
})

const hideAssistant = () => {
  isVisible.value = false
}

const showAssistant = async () => {
  isVisible.value = true
  if (!aiMessage.value) {
    aiMessage.value = generateRandomResponse(analytics.value)
  }
}

const toggleChat = () => {
  showChat.value = !showChat.value
  if (showChat.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
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
  font-weight: normal;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-questions {
  border-top: 1px solid rgba(239, 68, 68, 0.1);
  padding-top: 12px;
  margin-top: 12px;
}

.questions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-btn {
  text-transform: none;
  font-weight: 500;
  letter-spacing: 0;
  border-radius: 12px;
  height: 40px;
  
  &:hover {
    background: rgba(239, 68, 68, 0.1);
    transform: translateY(-1px);
  }t
  
  &.v-btn--loading {
    transform: none;
  }
}

.chat-section {
  border-top: 1px solid rgba(239, 68, 68, 0.1);
  padding-top: 12px;
}

.chat-messages {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 4px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(239, 68, 68, 0.2);
    border-radius: 4px;
  }
}

.message {
  margin-bottom: 8px;
  display: flex;
  
  &.user {
    justify-content: flex-end;
    
    .message-content {
      background: rgba(239, 68, 68, 0.1);
      border-radius: 12px 12px 0 12px;
    }
  }
  
  &.assistant {
    justify-content: flex-start;
    
    .message-content {
      background: #f1f5f9;
      border-radius: 12px 12px 12px 0;
    }
  }
}

.message-content {
  padding: 8px 12px;
  max-width: 85%;
  font-size: 14px;
  line-height: 1.4;
}

.chat-input {
  :deep(.v-field) {
    border-radius: 12px;
    
    &.v-field--focused {
      .v-field__outline {
        --v-field-border-opacity: 0.2;
      }
    }
  }
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

.message {
  &.assistant .message-content {
    font-weight: normal;
    letter-spacing: normal;
  }
}
</style> 