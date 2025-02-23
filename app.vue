<template>
  <v-app>
    <v-main class="bg-background">
      <v-container class="main-container pa-0">
        <!-- Replace drawer with tabs -->
        <v-card flat class="mb-4">
          <v-tabs
            v-model="activeTab"
            color="primary"
            align-tabs="center"
          >
            <v-tab value="finance" to="/">
              <v-icon start>mdi-wallet</v-icon>
              Finance
            </v-tab>
            <v-tab value="tasks" to="/tasks">
              <v-icon start>mdi-format-list-checks</v-icon>
              Tasks
            </v-tab>
          </v-tabs>
        </v-card>

        <router-view />
      </v-container>
      
      <!-- Action Buttons - Only show on finance tab -->
      <div v-if="!isTasksPage" class="action-buttons-container px-4 py-3">
        <div class="action-buttons-wrapper">
          <v-btn
            class="action-button"
            color="success"
            size="large"
            elevation="2"
            @click="openNumpad('income')"
          >
            <v-icon size="20" class="mr-2">mdi-arrow-up</v-icon>
            Income
          </v-btn>
          
          <v-btn
            class="action-button"
            color="error"
            size="large"
            elevation="2"
            @click="openNumpad('expense')"
          >
            <v-icon size="20" class="mr-2">mdi-arrow-down</v-icon>
            Expense
          </v-btn>
        </div>
      </div>
    </v-main>

    <ExpenseNumpad 
      v-model="showNumpad"
      :transaction-type="transactionType"
      @confirm="handleExpenseConfirm" 
    />
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStorage } from '../composables/useStorage'

const route = useRoute()
const activeTab = ref('finance')
const { addTransaction } = useStorage()

const showNumpad = ref(false)
const transactionType = ref('expense')

// Check if current page is tasks
const isTasksPage = computed(() => {
  return route.path.startsWith('/tasks')
})

// Update active tab based on route
watch(route, (newRoute) => {
  activeTab.value = newRoute.path.startsWith('/tasks') ? 'tasks' : 'finance'
})

const openNumpad = (type) => {
  transactionType.value = type
  showNumpad.value = true
}

const handleExpenseConfirm = ({ amount, type, category }) => {
  addTransaction({
    amount,
    type,
    category: category?.name || 'Other',
  })
  showNumpad.value = false
}
</script>

<style lang="scss" scoped>
.bg-background {
  background: #f8fafc;
  min-height: 100vh;
  padding-bottom: 84px;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 16px;
}

.action-buttons-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.action-buttons-wrapper {
  max-width: 768px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
  
  .action-button {
    flex: 1;
    height: 48px;
    border-radius: 12px !important;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
}
</style>