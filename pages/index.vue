<template>
  <div class="dashboard">
    <!-- Header Section -->
    <div class="header-section">
      <v-container class="py-6 px-4">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <div class="text-overline text-medium-emphasis">Welcome back</div>
            <div class="text-h5 font-weight-bold">John Doe</div>
          </div>
          <v-avatar color="primary" size="40">JD</v-avatar>
        </div>
      
        <!-- Balance Card -->
        <v-card class="balance-card" elevation="0">
          <v-card-text class="pa-8">
            <div class="text-subtitle-2 text-white text-opacity-75">Total Balance</div>
            <div class="balance-amount mt-2">
              <span class="text-h2 font-weight-bold">${{ Math.abs(balance).toFixed(0) }}</span>
              <span class="text-h5">.{{ Math.abs(balance).toFixed(2).split('.')[1] }}</span>
            </div>
            
            <v-divider class="my-6 border-opacity-15"></v-divider>
            
            <div class="d-flex justify-space-between">
              <div>
                <div class="d-flex align-center mb-1">
                  <v-icon color="success" size="20" class="mr-2">mdi-arrow-up</v-icon>
                  <span class="text-body-2">Income</span>
                </div>
                <div class="text-h6 font-weight-bold">${{ monthlyStats.income.toFixed(2) }}</div>
              </div>
              <div>
                <div class="d-flex align-center mb-1">
                  <v-icon color="error" size="20" class="mr-2">mdi-arrow-down</v-icon>
                  <span class="text-body-2">Expenses</span>
                </div>
                <div class="text-h6 font-weight-bold">${{ monthlyStats.expenses.toFixed(2) }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </div>

    <!-- Main Content -->
    <v-container class="content-section px-4 py-6">
      <!-- Quick Stats -->
      <div class="stats-wrapper mb-8">
        <v-card class="stat-card" elevation="0">
          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="d-flex align-center">
                <v-avatar
                  color="primary"
                  class="mr-3"
                  size="36"
                >
                  <v-icon color="white" size="20">mdi-wallet</v-icon>
                </v-avatar>
                <span class="text-subtitle-1 font-weight-medium">Monthly Spend</span>
              </div>
              <span class="text-h6 font-weight-bold">${{ monthlyStats.expenses.toFixed(2) }}</span>
            </div>
            <div class="d-flex align-center justify-space-between text-caption text-medium-emphasis mt-1">
              <span>65% of budget used</span>
              <span>$2,500 budget</span>
            </div>
            <v-progress-linear
              class="mt-2"
              :model-value="(monthlyStats.expenses / monthlyStats.budget) * 100"
              color="primary"
              height="6"
              rounded
            ></v-progress-linear>
          </v-card-text>
        </v-card>

        <v-card class="stat-card mt-4" elevation="0">
          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-2">
              <div class="d-flex align-center">
                <v-avatar
                  color="error"
                  class="mr-3"
                  size="36"
                >
                  <v-icon color="white" size="20">mdi-chart-line</v-icon>
                </v-avatar>
                <span class="text-subtitle-1 font-weight-medium">Budget Left</span>
              </div>
              <span class="text-h6 font-weight-bold">${{ monthlyStats.remaining.toFixed(2) }}</span>
            </div>
            <div class="d-flex align-center justify-space-between text-caption text-medium-emphasis mt-1">
              <span>25% remaining</span>
              <span>7 days left</span>
            </div>
            <v-progress-linear
              class="mt-2"
              :model-value="(monthlyStats.remaining / monthlyStats.budget) * 100"
              color="error"
              height="6"
              rounded
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </div>

      <!-- Recent Transactions -->
      <div class="transactions-section">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="text-subtitle-1 font-weight-bold">Recent Transactions</div>
          <v-btn variant="text" density="comfortable" class="text-none">
            See All
            <v-icon end size="18">mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        
        <TransactionList :transactions="recentTransactions" />
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStorage } from '../composables/useStorage'

const { balance, transactions } = useStorage()

// Calculate monthly stats
const monthlyStats = computed(() => {
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const monthlyTransactions = transactions.value.filter(t => {
    const date = new Date(t.date)
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear
  })

  const income = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return {
    income,
    expenses,
    budget: 2500, // You might want to make this configurable
    remaining: 2500 - expenses
  }
})

// Get recent transactions
const recentTransactions = computed(() => 
  transactions.value.slice(0, 5)
)
</script>

<style lang="scss" scoped>
.dashboard {
  min-height: 100vh;
  background: #f8fafc;
}

.header-section {
  background: white;
  border-radius: 0 0 32px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.balance-card {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border-radius: 24px;

  .balance-amount {
    display: flex;
    align-items: baseline;
    gap: 4px;
    
    .text-h5 {
      opacity: 0.75;
    }
  }
}

.stat-card {
  border-radius: 20px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);

  .v-card-text {
    padding: 20px;
  }
}

.transactions-section {
  margin-bottom: 100px;
}

@media (max-width: 600px) {
  .header-section {
    border-radius: 0 0 24px 24px;
  }
  
  .balance-card {
    border-radius: 20px;
  }
  
  .stat-card {
    border-radius: 16px;
  }

  .content-section {
    padding-top: 16px;
    padding-bottom: 16px;
  }
}
</style> 