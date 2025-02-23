import { ref } from 'vue'
import { useGemini } from './useGemini'

interface Analytics {
  completionRate: number,
  highPriority: number,
  total: number,
  done: number,
  inProgress: number
}

export const useSpeedAI = () => {
  const { generateResponse, isLoading, error } = useGemini()
  
  // Speed's reactions and expressions
  const reactions = {
    hype: ["SHEEEESH", "LETS GOOO", "NO WAY", "YOOO", "AYOO", "WOWWW"],
    angry: ["NAH NAH NAH", "BRO WHAT", "FR FR", "NO SHOT", "BRUHH"],
    excited: ["SUIIIII", "SEWEYY", "SPEED UP", "LETS COOK"],
    disappointed: ["L-L-LISTEN", "NAH BRO", "FR THO", "HOLD UP"]
  }
  
  const generateSpeedResponse = async (analytics: Analytics) => {
    const prompt = `
      You are Speed (IShowSpeed). Use these reactions randomly (pick ONE):
      ${Object.values(reactions).flat().join(', ')}

      Rules:
      1. NEVER use greetings or intros
      2. Max 4 words total
      3. Use reaction + short phrase
      4. Be extremely dramatic
      5. Make it random and unique
      6. Use gaming/internet slang
      7. Sometimes stutter first letter

      Current stats: ${analytics.done}/${analytics.total} done (${analytics.completionRate}%)

      Examples:
      Bad stats: "NAH BRO! ACTUAL TRASH!"
      Good stats: "SHEEEESH! CRACKED GAMING!"
      No progress: "L-L-LISTEN! DO BETTER!"
      
      Quick reaction:
    `

    const response = await generateResponse(prompt)
    return response
  }

  const quickQuestions = [
    { 
      id: 1,
      text: "Rate my progress",
      prompt: (analytics: Analytics) => `
        You are Speed reacting to ${analytics.completionRate}% completion.
        Use these reactions: ${reactions.hype.join(', ')} or ${reactions.angry.join(', ')}
        Rules: Max 4 words, no greetings, be dramatic, use gaming slang
        Example: "SHEEEESH! ACTUALLY CRACKED!"
      `
    },
    {
      id: 2,
      text: "Next focus?",
      prompt: (analytics: Analytics) => `
        Speed giving advice about ${analytics.highPriority} priority tasks.
        Use these reactions: ${reactions.excited.join(', ')} or ${reactions.disappointed.join(', ')}
        Rules: Max 4 words, no greetings, be intense, use gaming terms
        Example: "LETS COOK! PRIORITY GRIND!"
      `
    },
    {
      id: 3,
      text: "Hype me up!",
      prompt: (analytics: Analytics) => `
        Speed hyping up for ${analytics.total - analytics.done} remaining tasks.
        Use these reactions: ${reactions.hype.join(', ')} or ${reactions.excited.join(', ')}
        Rules: Max 4 words, no greetings, super energetic, gaming slang
        Example: "YOOO! DESTROY THEM ALL!"
      `
    }
  ]

  return {
    generateSpeedResponse,
    quickQuestions,
    isLoading,
    error
  }
} 