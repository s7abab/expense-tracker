import { ref } from 'vue'

interface GeminiMessage {
  role: 'user' | 'model'
  parts: [{
    text: string
  }]
}

interface GeminiResponse {
  candidates: [{
    content: {
      parts: [{
        text: string
      }]
    }
  }]
}

export const useGemini = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const generateResponse = async (message: string): Promise<string | null> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<GeminiResponse>('/api/gemini', {
        method: 'POST',
        body: {
          messages: [{
            role: 'user',
            parts: [{ text: message }]
          }]
        }
      })

      return response?.candidates?.[0]?.content?.parts?.[0]?.text || null
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