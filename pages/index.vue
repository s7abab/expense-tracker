<template>
  <div class="dashboard">
    <!-- Header Section -->
    <div class="header-section">
      <v-container class="py-6 px-4">
        <div class="d-flex align-center justify-space-between mb-4">
          <div>
            <div class="text-overline text-medium-emphasis">Welcome back</div>
            <div class="text-h5 font-weight-bold">John Doe</div>
          </div>
          <v-avatar color="primary" size="40">JD</v-avatar>
        </div>
      
        <!-- Balance Card -->
        <v-card class="balance-card mt-4">
          <v-card-text class="pa-6">
            <div class="text-overline mb-1">Available Balance</div>
            <div class="text-h4 font-weight-bold mb-2">$2,450.65</div>
            <div class="d-flex justify-space-between text-caption">
              <span class="text-success">
                <v-icon size="16">mdi-arrow-up</v-icon>
                Income: $4,291.15
              </span>
              <span class="text-error">
                <v-icon size="16">mdi-arrow-down</v-icon>
                Expenses: $1,840.50
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </div>

    <!-- Main Content -->
    <v-container class="content-section px-4 py-6">
      <!-- Quick Stats -->
      <v-row class="mb-6">
        <v-col cols="6" sm="6" md="3">
          <v-card class="stat-card">
            <v-card-text class="pa-4">
              <v-icon color="primary" size="24" class="mb-2">mdi-wallet</v-icon>
              <div class="text-caption text-medium-emphasis">This Month</div>
              <div class="text-h6 font-weight-bold">$1,840.50</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" sm="6" md="3">
          <v-card class="stat-card">
            <v-card-text class="pa-4">
              <v-icon color="error" size="24" class="mb-2">mdi-chart-line</v-icon>
              <div class="text-caption text-medium-emphasis">Budget Left</div>
              <div class="text-h6 font-weight-bold">$659.50</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Recent Transactions -->
      <div class="transactions-section">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="text-h6">Recent Transactions</div>
          <v-btn variant="text" density="comfortable">
            See All
            <v-icon end>mdi-chevron-right</v-icon>
          </v-btn>
        </div>
        
        <TransactionList :transactions="recentTransactions" />
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const recentTransactions = ref([
  {
    id: 1,
    title: 'Grocery Shopping',
    amount: -85.50,
    category: 'Food',
    time: '2:30 PM',
    icon: 'mdi-cart',
    color: 'primary'
  },
  // Add more transactions...
])
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
}

.content-section {
  margin-top: 16px;
}

.stat-card {
  height: 100%;
  border-radius: 20px;
  background: white;
}

.transactions-section {
  margin-bottom: 100px; // Space for action buttons
}

@media (max-width: 600px) {
  .header-section {
    border-radius: 0 0 24px 24px;
  }
  
  .balance-card {
    border-radius: 16px;
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