<template>
  <v-bottom-sheet
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    class="numpad-sheet"
    scrollable
  >
    <v-card class="numpad-container" elevation="0">
      <v-card-text class="pa-0">
        <!-- Amount Display -->
        <div class="amount-display" :class="transactionType">
          <div class="amount-wrapper pa-6">
            <div class="text-subtitle-1 text-medium-emphasis">
              Enter {{ transactionType === 'income' ? 'Income' : 'Expense' }} Amount
            </div>
            <div class="amount-text">
              <span class="currency">$</span>
              <span class="digits">{{ formattedAmount }}</span>
            </div>
          </div>
          
          <!-- Category Quick Select -->
          <div class="category-chips px-4 pb-4">
            <v-chip-group v-model="selectedCategory" mandatory>
              <v-chip
                v-for="category in currentCategories"
                :key="category.id"
                :value="category.id"
                filter
                variant="elevated"
                class="category-chip"
              >
                <v-icon :icon="category.icon" size="18" start />
                {{ category.name }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>

        <!-- Numpad Grid -->
        <div class="numpad-wrapper px-4 pb-6">
          <div class="numpad-grid">
            <v-btn
              v-for="key in numpadKeys"
              :key="key"
              class="numpad-key"
              variant="text"
              :ripple="false"
              @click="handleNumpadInput(key)"
            >
              <template v-if="key === 'backspace'">
                <v-icon size="24">mdi-backspace-outline</v-icon>
              </template>
              <template v-else>
                {{ key }}
              </template>
            </v-btn>
          </div>

          <!-- Single Action Button -->
          <v-btn
            block
            :color="transactionType === 'income' ? 'success' : 'error'"
            height="56"
            class="action-btn mt-6"
            :disabled="!currentAmount"
            @click="confirmAmount"
          >
            <v-icon start>
              {{ transactionType === 'income' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
            </v-icon>
            Add {{ transactionType === 'income' ? 'Income' : 'Expense' }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  transactionType: {
    type: String,
    default: 'expense',
    validator: (value) => ['income', 'expense'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const currentAmount = ref('')
const selectedCategory = ref(null)

const expenseCategories = [
  { id: 1, name: 'Food', icon: 'mdi-food' },
  { id: 2, name: 'Transport', icon: 'mdi-car' },
  { id: 3, name: 'Shopping', icon: 'mdi-shopping' },
  { id: 4, name: 'Bills', icon: 'mdi-file-document' },
]

const incomeCategories = [
  { id: 5, name: 'Salary', icon: 'mdi-cash' },
  { id: 6, name: 'Freelance', icon: 'mdi-laptop' },
  { id: 7, name: 'Investment', icon: 'mdi-chart-line' },
  { id: 8, name: 'Other', icon: 'mdi-plus-circle' },
]

const currentCategories = computed(() => 
  props.transactionType === 'income' ? incomeCategories : expenseCategories
)

const numpadKeys = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '.', '0', 'backspace'
]

const formattedAmount = computed(() => {
  if (!currentAmount.value) return '0.00'
  return Number(currentAmount.value).toFixed(2)
})

const handleNumpadInput = (key) => {
  if (key === 'backspace') {
    currentAmount.value = currentAmount.value.slice(0, -1)
    return
  }
  
  if (key === '.' && currentAmount.value.includes('.')) return
  if (currentAmount.value.includes('.') && currentAmount.value.split('.')[1]?.length >= 2) return
  
  currentAmount.value += key
}

const confirmAmount = () => {
  emit('confirm', {
    amount: Number(currentAmount.value),
    type: props.transactionType,
    category: selectedCategory.value
  })
  currentAmount.value = ''
}
</script>

<style lang="scss" scoped>
.numpad-sheet {
  .numpad-container {
    border-radius: 32px 32px 0 0;
    overflow: hidden;
  }

  .amount-display {
    &.income {
      background: linear-gradient(135deg, #22c55e, #16a34a);
    }
    
    &.expense {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }
    color: white;
  }

  .amount-wrapper {
    text-align: center;
  }

  .amount-text {
    font-size: 48px;
    font-weight: 700;
    margin-top: 8px;
    
    .currency {
      opacity: 0.8;
      margin-right: 4px;
    }
  }

  .category-chips {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .category-chip {
    margin-right: 8px;
    background: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    
    &--selected {
      background: white !important;
      color: var(--v-primary-base) !important;
    }
  }

  .numpad-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 24px;
  }

  .numpad-key {
    aspect-ratio: 1;
    font-size: 28px;
    font-weight: 500;
    border-radius: 16px;
    background: #f1f5f9;
    color: #1e293b;
    
    &:active {
      background: #e2e8f0;
    }
  }

  .action-btn {
    border-radius: 16px;
    font-size: 16px;
    font-weight: 600;
  }
}
</style> 