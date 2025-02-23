<template>
  <v-app>
    <v-main class="bg-background">
      <router-view />
      
      <!-- Action Buttons -->
      <div class="action-buttons-wrapper">
        <div class="action-buttons d-flex gap-3">
          <v-btn
            class="action-button"
            color="success"
            size="x-large"
            elevation="4"
            @click="openNumpad('income')"
          >
            <v-icon size="24" class="mr-2">mdi-arrow-up</v-icon>
            Income
          </v-btn>
          
          <v-btn
            class="action-button"
            color="error"
            size="x-large"
            elevation="4"
            @click="openNumpad('expense')"
          >
            <v-icon size="24" class="mr-2">mdi-arrow-down</v-icon>
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
import { ref } from 'vue'

const showNumpad = ref(false)
const transactionType = ref('expense')

const openNumpad = (type) => {
  transactionType.value = type
  showNumpad.value = true
}

const handleExpenseConfirm = ({ amount, type }) => {
  // TODO: Handle the expense/income addition
  showNumpad.value = false
}
</script>

<style lang="scss" scoped>
.bg-background {
  background: #f8fafc;
  min-height: 100vh;
}

.action-buttons-wrapper {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 400px;
  z-index: 100;
}

.action-buttons {
  width: 100%;
}

.action-button {
  flex: 1;
  height: 56px;
  border-radius: 16px !important;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  backdrop-filter: blur(10px);
}
</style>