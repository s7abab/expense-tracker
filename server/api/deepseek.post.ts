export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.deepseekApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          ...body.messages
        ],
        temperature: body.temperature || 0.7,
        max_tokens: body.maxTokens || 1000,
        stream: false
      })
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: `Deepseek API Error: ${response.statusText}`
      })
    }

    return await response.json()
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Internal Server Error'
    })
  }
}) 