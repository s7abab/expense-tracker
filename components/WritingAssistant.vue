<template>
  <div class="writing-assistant">
    <v-container class="py-4">
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="editor-card">
            <!-- Header -->
            <div class="header-section px-6 py-4">
              <div class="d-flex align-center justify-space-between">
                <div class="text-h6">Writing Assistant</div>
                <div class="d-flex gap-2">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    :loading="isAnalyzing && activeAction === 'analyze'"
                    :disabled="isAnalyzing"
                    @click="analyzeText"
                  >
                    <v-icon start>mdi-magnify</v-icon>
                    Analyze
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    :loading="isAnalyzing && activeAction === 'rewrite'"
                    :disabled="isAnalyzing"
                    @click="showRewriteOptions = true"
                  >
                    <v-icon start>mdi-refresh</v-icon>
                    Rewrite
                  </v-btn>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    :loading="isAnalyzing && activeAction === 'grammar'"
                    :disabled="isAnalyzing"
                    @click="fixGrammar"
                  >
                    <v-icon start>mdi-spellcheck</v-icon>
                    Fix Grammar
                  </v-btn>
                </div>
              </div>
            </div>

            <!-- Toolbar -->
            <div class="toolbar-section px-4 py-2">
              <v-chip-group>
                <v-chip
                  v-for="quickFix in quickFixes"
                  :key="quickFix.id"
                  class="quick-fix-chip"
                  color="primary"
                  variant="outlined"
                  @click="applyQuickFix(quickFix)"
                >
                  {{ quickFix.label }}
                </v-chip>
              </v-chip-group>
            </div>

            <!-- Editor -->
            <v-card-text class="editor-area pa-6">
              <v-textarea
                v-model="content"
                label="Start writing..."
                variant="outlined"
                auto-grow
                rows="12"
                class="editor-textarea"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Analysis Panel -->
        <v-col cols="12" md="4">
          <v-card class="analysis-card">
            <v-card-text class="pa-6">
              <div v-if="isAnalyzing" class="d-flex justify-center py-4">
                <v-progress-circular indeterminate color="primary" />
              </div>
              
              <template v-else-if="analysis">
                <!-- Scores -->
                <div class="scores mb-6">
                  <div class="text-subtitle-2 font-weight-bold mb-4">Writing Scores</div>
                  <v-row>
                    <v-col cols="6">
                      <v-progress-circular
                        :model-value="analysis.readabilityScore"
                        color="primary"
                        size="80"
                      >
                        {{ analysis.readabilityScore }}
                      </v-progress-circular>
                      <div class="text-caption mt-2">Readability</div>
                    </v-col>
                    <v-col cols="6">
                      <v-progress-circular
                        :model-value="analysis.clarityScore"
                        color="info"
                        size="80"
                      >
                        {{ analysis.clarityScore }}
                      </v-progress-circular>
                      <div class="text-caption mt-2">Clarity</div>
                    </v-col>
                  </v-row>
                </div>

                <!-- Suggestions -->
                <div class="suggestions">
                  <div class="text-subtitle-2 font-weight-bold mb-2">Suggestions</div>
                  <v-list lines="two">
                    <v-list-item
                      v-for="(suggestion, index) in analysis.suggestions"
                      :key="index"
                      :subtitle="suggestion"
                      class="suggestion-item"
                    >
                      <template #prepend>
                        <v-icon color="warning" size="small" class="mt-1">
                          mdi-lightbulb
                        </v-icon>
                      </template>
                    </v-list-item>
                  </v-list>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Rewrite Options Dialog -->
    <v-dialog v-model="showRewriteOptions" max-width="500">
      <v-card>
        <v-card-title class="text-h6 pa-4">
          Choose Rewrite Style
        </v-card-title>
        <v-card-text class="pa-4">
          <v-list>
            <v-list-item
              v-for="style in rewriteStyles"
              :key="style.id"
              :title="style.title"
              :subtitle="style.description"
              class="mb-2"
              rounded="lg"
              @click="rewriteText(style.id)"
            >
              <template #prepend>
                <v-icon :color="style.color">{{ style.icon }}</v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGemini } from '../composables/useGemini'

const { generateResponse, isLoading: isAnalyzing } = useGemini()

const content = ref('')
const analysis = ref(null)
const quickFixes = ref([])
const showRewriteOptions = ref(false)
const activeAction = ref(null)

const rewriteStyles = [
  {
    id: 'short',
    title: 'Short & Concise',
    description: 'Clear and brief version of your text',
    icon: 'mdi-format-align-left',
    color: 'deep-purple'
  },
  {
    id: 'professional',
    title: 'Professional',
    description: 'Formal and business-appropriate tone',
    icon: 'mdi-briefcase',
    color: 'primary'
  },
  {
    id: 'casual',
    title: 'Casual',
    description: 'Friendly and conversational style',
    icon: 'mdi-chat',
    color: 'success'
  },
  {
    id: 'academic',
    title: 'Academic',
    description: 'Scholarly and research-oriented format',
    icon: 'mdi-school',
    color: 'info'
  },
  {
    id: 'creative',
    title: 'Creative',
    description: 'Engaging and imaginative expression',
    icon: 'mdi-palette',
    color: 'warning'
  }
]

const analyzeText = async () => {
  if (!content.value.trim()) return
  activeAction.value = 'analyze'
  isAnalyzing.value = true

  try {
    const prompt = `
      Analyze this text and provide feedback in JSON format:
      "${content.value}"

      Return a JSON object with:
      1. readabilityScore (0-100)
      2. clarityScore (0-100)
      3. suggestions (array of improvement suggestions)
      4. quickFixes (array of objects with {id, label, original, replacement})
    `

    const response = await generateResponse(prompt)
    if (response) {
      try {
        const result = JSON.parse(response)
        analysis.value = result
        quickFixes.value = result.quickFixes || []
      } catch (err) {
        console.error('Failed to parse analysis:', err)
      }
    }
  } finally {
    isAnalyzing.value = false
    activeAction.value = null
  }
}

const rewriteText = async (style) => {
  if (!content.value.trim()) return
  showRewriteOptions.value = false
  activeAction.value = 'rewrite'
  isAnalyzing.value = true

  try {
    let prompt = `
      Rewrite this text in ${style} style while maintaining the core message:
      "${content.value}"
      
      Return only the rewritten text without any explanations or JSON formatting.
    `

    if (style === 'short') {
      prompt = `
        Make this text shorter and more concise while keeping the main message:
        "${content.value}"
        
        Guidelines:
        1. Remove unnecessary words and phrases
        2. Use shorter sentences
        3. Keep only essential information
        4. Maintain clarity and professionalism
        
        Return only the rewritten text without any explanations.
      `
    }

    const response = await generateResponse(prompt)
    if (response) {
      content.value = response
      await analyzeText()
    }
  } finally {
    isAnalyzing.value = false
    activeAction.value = null
  }
}

const fixGrammar = async () => {
  if (!content.value.trim()) return
  activeAction.value = 'grammar'
  isAnalyzing.value = true

  try {
    const prompt = `
      Fix grammar and spelling errors in this text:
      "${content.value}"
      
      Return only the corrected text without any explanations.
    `

    const response = await generateResponse(prompt)
    if (response) {
      content.value = response
      await analyzeText()
    }
  } finally {
    isAnalyzing.value = false
    activeAction.value = null
  }
}

const applyQuickFix = (fix) => {
  content.value = content.value.replace(fix.original, fix.replacement)
  quickFixes.value = quickFixes.value.filter(f => f !== fix)
}
</script>

<style lang="scss" scoped>
.writing-assistant {
  min-height: 100vh;
  background: #f8fafc;
}

.editor-card {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.header-section {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.toolbar-section {
  background: #fafafa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.style-select {
  min-width: 200px;
}

.editor-area {
  .editor-textarea {
    border-radius: 12px;
    
    :deep(.v-field) {
      border-radius: 12px;
      
      &.v-field--focused {
        box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
      }
    }
  }
}

.quick-fix-chip {
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.analysis-card {
  border-radius: 24px;
  position: sticky;
  top: 24px;
}

.suggestion-item {
  border-radius: 12px;
  margin-bottom: 8px;
  
  &:hover {
    background: #f8fafc;
  }
}
</style> 