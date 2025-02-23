<template>
  <v-card class="analytics-card">
    <div class="ai-assistant">
      <v-avatar
        image="https://cdn3d.iconscout.com/3d/premium/thumb/ai-robot-assistant-9749582-7929895.png"
        size="48"
        class="assistant-avatar"
      />
      <div class="message-bubble">
        <div class="assistant-name">Luna AI</div>
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
    `You have completed ${analytics.value.done} out of ${analytics.value.total} tasks (${analytics.value.completionRate}%). ${
      analytics.value.completionRate > 70 ? "That's impressive! 🌟" : "Keep pushing forward! 💪"
    }`,
    `${analytics.value.highPriority} high-priority tasks need attention. ${
      analytics.value.inProgress ? "I see you're actively working on some of them!" : "Let's tackle them one by one!"
    }`,
    `${analytics.value.inProgress} tasks in progress. ${
      analytics.value.inProgress > 3 ? "Remember to focus on one thing at a time! 🎯" : "Great focus management! ✨"
    }`
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
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 4px;
}

.analysis-text {
  font-size: 14px;
  line-height: 1.4;
  color: #4b5563;
}
</style> 