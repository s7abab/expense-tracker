import { ref, watch } from 'vue'
import { useState } from '#app'

export interface Task {
  id: number
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  assignee: {
    id: number
    name: string
    avatar: string
  }
  dueDate: string
  status: 'todo' | 'inProgress' | 'done'
}

export const useTasks = () => {
  const tasks = useState<Task[]>('tasks', () => [])

  if (process.client) {
    const stored = localStorage.getItem('tasks')
    if (stored) {
      tasks.value = JSON.parse(stored)
    }

    watch(tasks, (newTasks) => {
      localStorage.setItem('tasks', JSON.stringify(newTasks))
    }, { deep: true })
  }

  const addTask = (task: Task) => {
    tasks.value = [task, ...tasks.value]
  }

  const updateTask = (updatedTask: Task) => {
    const index = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (index !== -1) {
      const newTasks = [...tasks.value]
      newTasks[index] = updatedTask
      tasks.value = newTasks
    }
  }

  const deleteTask = (taskId: number) => {
    tasks.value = tasks.value.filter(t => t.id !== taskId)
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  }
} 