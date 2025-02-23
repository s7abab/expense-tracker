<template>
  <div class="deepseek-chat">
    <v-card class="chat-container">
      <v-card-title class="d-flex align-center pa-4">
        <v-avatar color="primary" class="mr-3" size="32">
          <v-icon color="white">mdi-robot</v-icon>
        </v-avatar>
        Deepseek AI Assistant
      </v-card-title>

      <v-card-text class="chat-messages pa-4">
        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="message.role"
        >
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>

        <v-progress-circular
          v-if="isLoading"
          indeterminate
          color="primary"
          class="mt-4"
        />
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-text-field
          v-model="userInput"
          placeholder="Type your message..."
          variant="outlined"
          density="comfortable"
          hide-details
          @keyup.enter="sendMessage"
        >
          <template #append>
            <v-btn
              :loading="isLoading"
              :disabled="!userInput.trim()"
              color="primary"
              icon
              @click="sendMessage"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
    >
      {{ error }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDeepseek } from '../composables/useDeepseek'

const { generateResponse, isLoading, error } = useDeepseek()

const userInput = ref('')
const messages = ref([])
const showError = ref(false)

watch(error, (newError) => {
  if (newError) {
    showError.value = true
  }
})

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  const userMessage = {
    role: 'user',
    content: userInput.value
  }
  
  messages.value.push(userMessage)
  const currentInput = userInput.value
  userInput.value = ''

  const response = await generateResponse(messages.value)
  
  if (response?.choices?.[0]?.message) {
    messages.value.push({
      role: 'assistant',
      content: response.choices[0].message.content
    })
  }
}
</script>

<style lang="scss" scoped>
.deepseek-chat {
  max-width: 800px;
  margin: 0 auto;
}

.chat-container {
  border-radius: 16px;
  overflow: hidden;
}

.chat-messages {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
}

.message {
  margin-bottom: 16px;
  display: flex;
  
  &.user {
    justify-content: flex-end;
    
    .message-content {
      background: var(--v-primary-base);
      color: white;
      border-radius: 16px 16px 0 16px;
    }
  }
  
  &.assistant {
    justify-content: flex-start;
    
    .message-content {
      background: #f1f5f9;
      border-radius: 16px 16px 16px 0;
    }
  }
}

.message-content {
  padding: 12px 16px;
  max-width: 70%;
  word-break: break-word;
}
</style> 