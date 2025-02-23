export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  interface GeminiMessage {
    role: string
    parts: { text: string }[]
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.geminiApiKey
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

    if (!response.ok) {
      const errorData = await response.json()
      throw createError({
        statusCode: response.status,
        message: `Gemini API Error: ${errorData.error?.message || response.statusText}`
      })
    }

    return await response.json()
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Internal Server Error'
    })
  }
}) 