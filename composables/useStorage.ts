import { ref, watch } from 'vue'
import { useState } from '#app'

export interface Transaction {
  id: number
  title: string
  amount: number
  category: string
  time: string
  date: string
  icon: string
  color: string
  type: 'income' | 'expense'
}

export const useStorage = () => {
  // Use Nuxt's useState for shared state
  const balance = useState<number>('balance', () => {
    if (process.client) {
      const stored = localStorage.getItem('balance')
      return stored ? Number(stored) : 0
    }
    return 0
  })

  const transactions = useState<Transaction[]>('transactions', () => {
    if (process.client) {
      const stored = localStorage.getItem('transactions')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  // Watch for changes and update localStorage
  if (process.client) {
    watch(balance, (newBalance) => {
      localStorage.setItem('balance', newBalance.toString())
    })

    watch(transactions, (newTransactions) => {
      localStorage.setItem('transactions', JSON.stringify(newTransactions))
    }, { deep: true })
  }

  const addTransaction = (transaction: Partial<Transaction>) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      title: transaction.title || transaction.category || 'Transaction',
      amount: Number(transaction.amount) || 0,
      category: transaction.category || 'Other',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      icon: getIconForCategory(transaction.category || 'Other'),
      color: transaction.type === 'income' ? 'success' : 'error',
      type: transaction.type || 'expense'
    }

    // Update balance
    const amount = Math.abs(Number(transaction.amount) || 0)
    balance.value += transaction.type === 'income' ? amount : -amount

    // Add to transactions
    transactions.value.unshift(newTransaction)
  }

  const getIconForCategory = (category: string): string => {
    const icons: Record<string, string> = {
      Food: 'mdi-food',
      Transport: 'mdi-car',
      Shopping: 'mdi-shopping',
      Bills: 'mdi-file-document',
      Salary: 'mdi-cash',
      Freelance: 'mdi-laptop',
      Investment: 'mdi-chart-line',
      Other: 'mdi-plus-circle'
    }
    return icons[category] || 'mdi-plus-circle'
  }

  return {
    balance,
    transactions,
    addTransaction
  }
} 