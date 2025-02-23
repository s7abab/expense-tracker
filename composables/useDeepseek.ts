import { ref } from 'vue'

interface DeepseekMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface DeepseekResponse {
  choices: [{
    message: {
      content: string
      role: string
    }
  }]
}

export const useDeepseek = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const generateResponse = async (messages: DeepseekMessage[]): Promise<DeepseekResponse | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/deepseek', {
        method: 'POST',
        body: {
          messages,
          temperature: 0.7,
          maxTokens: 1000
        }
      })

      return response as DeepseekResponse
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    generateResponse,
    isLoading,
    error
  }
} 