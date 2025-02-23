export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Split API keys string into array
  const apiKeys = config.geminiApiKey.split(',').map(key => key.trim())

  interface GeminiMessage {
    role: string
    parts: { text: string }[]
  }

  // Try each API key until successful
  for (const apiKey of apiKeys) {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: body.messages[body.messages.length - 1].parts[0].text
            }]
          }],
          generationConfig: {
            temperature: body.temperature || 0.7,
            maxOutputTokens: body.maxTokens || 1000,
          }
        })
      })

      // If rate limit error (429), continue to next key
      if (response.status === 429) {
        continue
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw createError({
          statusCode: response.status,
          message: `Gemini API Error: ${errorData.error?.message || response.statusText}`
        })
      }

      return await response.json()
    } catch (error) {
      // If this is the last API key, throw the error
      if (apiKey === apiKeys[apiKeys.length - 1]) {
        console.error('Gemini API Error:', error)
        throw createError({
          statusCode: 500,
          message: error instanceof Error ? error.message : 'Internal Server Error'
        })
      }
      // Otherwise continue to next key
      continue
    }
  }
}) 