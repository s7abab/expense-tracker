<template>
  <div class="tasks-page">
    <v-card class="board-container">
      <div class="board-wrapper">
        <div 
          v-for="column in columns" 
          :key="column.id"
          class="column"
        >
          <div class="column-header">
            <div 
              class="d-flex align-center justify-space-between pa-4 pb-2"
              :class="`column-header-${column.id}`"
            >
              <div class="d-flex align-center">
                <v-icon :color="column.iconColor" class="mr-2" :icon="column.icon" />
                <span class="text-subtitle-1 font-weight-medium text-white">{{ column.name }}</span>
                <v-chip
                  :color="column.chipColor"
                  class="ml-2 task-count-chip"
                  size="small"
                  variant="flat"
                >
                  {{ tasksByStatus[column.id].length }}
                </v-chip>
              </div>
            </div>

            <!-- Quick Add Task Input -->
            <div 
              v-if="newTaskColumn === column.id" 
              class="quick-add-task px-4 pb-3"
              :class="`column-header-${column.id}`"
            >
              <v-text-field
                v-model="quickTask.title"
                :placeholder="`Add task...`"
                variant="outlined"
                density="compact"
                hide-details
                autofocus
                class="quick-add-field"
                @keyup.enter="saveQuickTask"
                @keyup.esc="cancelQuickTask"
              >
                <template #append>
                  <div class="d-flex gap-1">
                    <v-btn
                      icon="mdi-check"
                      size="x-small"
                      :color="column.chipColor"
                      variant="text"
                      @click.stop="saveQuickTask"
                    />
                    <v-btn
                      icon="mdi-close"
                      size="x-small"
                      color="error"
                      variant="text"
                      @click.stop="cancelQuickTask"
                    />
                  </div>
                </template>
              </v-text-field>
            </div>

            <!-- Add Task Button -->
            <div 
              v-else 
              class="px-4 pb-3"
              :class="`column-header-${column.id}`"
            >
              <v-btn
                block
                variant="text"
                color="white"
                density="compact"
                class="add-task-btn"
                @click="startNewTask(column.id)"
              >
                <v-icon start size="small">mdi-plus</v-icon>
                Add task
              </v-btn>
            </div>
          </div>

          <div class="tasks-list">
            <draggable
              :list="tasksByStatus[column.id]"
              group="tasks"
              item-key="id"
              class="draggable-container"
              :animation="200"
              ghost-class="ghost-card"
              @change="(e) => handleDragChange(e, column.id)"
            >
              <template #item="{ element: task }">
                <div class="task-wrapper">
                  <v-hover v-slot="{ isHovering, props }">
                    <v-card
                      v-bind="props"
                      :elevation="isHovering ? 3 : 1"
                      class="task-card"
                      :class="{
                        'on-hover': isHovering,
                        'task-focused': focusedTaskId === task.id
                      }"
                      @dblclick="handleTaskDoubleClick(task.id)"
                    >
                      <v-card-text class="pa-4">
                        <!-- Priority Strip -->
                        <div 
                          class="priority-strip" 
                          :class="`priority-${task.priority?.toLowerCase() || 'medium'}`"
                        ></div>

                        <!-- Title and Priority -->
                        <div class="d-flex justify-space-between align-center mb-3">
                          <div class="text-subtitle-1 font-weight-medium text-truncate">
                            {{ task.title }}
                          </div>
                          <v-chip
                            size="small"
                            :color="getPriorityColor(task.priority)"
                            class="priority-chip"
                            variant="tonal"
                            @click.stop="togglePriority(task)"
                          >
                            <v-icon 
                              size="14" 
                              start 
                              class="me-1"
                            >
                              mdi-flag
                            </v-icon>
                            {{ task.priority || 'Medium' }}
                          </v-chip>
                        </div>

                        <!-- Date and Actions -->
                        <div class="d-flex justify-space-between align-center">
                          <div class="d-flex align-center">
                            <v-icon
                              size="16"
                              :color="getPriorityColor(task.priority)"
                              class="me-2"
                            >
                              mdi-clock-outline
                            </v-icon>
                            <span class="text-caption text-medium-emphasis">
                              {{ formatDate(task.createdAt) }}
                            </span>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-hover>
                </div>
              </template>
            </draggable>
          </div>
        </div>
      </div>
    </v-card>
    <TaskAnalytics :tasks="tasks" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { useTasks } from '../../composables/useTasks'
import TaskAnalytics from '../../components/TaskAnalytics.vue'

const tasksListRef = ref(null)
const { tasks, addTask, updateTask } = useTasks()

const newTaskColumn = ref(null)
const quickTask = ref({
  title: '',
})

const focusedTaskId = ref(null)

const priorities = ['High', 'Medium', 'Low']

const columns = [
  { 
    id: 'todo', 
    name: 'To Do', 
    icon: 'mdi-format-list-checks', 
    color: 'primary',
    iconColor: 'white',
    chipColor: 'rgba(255,255,255,0.15)',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)'
  },
  { 
    id: 'inProgress', 
    name: 'In Progress', 
    icon: 'mdi-progress-clock', 
    color: 'info',
    iconColor: 'white',
    chipColor: 'rgba(255,255,255,0.15)',
    gradient: 'linear-gradient(135deg, #0EA5E9, #2563EB)'
  },
  { 
    id: 'done', 
    name: 'Done', 
    icon: 'mdi-check-circle', 
    color: 'success',
    iconColor: 'white',
    chipColor: 'rgba(255,255,255,0.15)',
    gradient: 'linear-gradient(135deg, #22C55E, #16A34A)'
  },
]

const tasksByStatus = computed(() => ({
  todo: tasks.value.filter(t => t.status === 'todo'),
  inProgress: tasks.value.filter(t => t.status === 'inProgress'),
  done: tasks.value.filter(t => t.status === 'done'),
}))

const startNewTask = (columnId) => {
  newTaskColumn.value = columnId
  quickTask.value.title = ''
}

const saveQuickTask = () => {
  if (quickTask.value.title.trim()) {
    addTask({
      id: Date.now(),
      title: quickTask.value.title,
      status: newTaskColumn.value,
      createdAt: new Date().toISOString(),
      priority: 'Medium', // Default priority
    })
    
    if (tasksListRef.value) {
      tasksListRef.value.scrollTop = 0
    }
  }
  newTaskColumn.value = null
}

const cancelQuickTask = () => {
  newTaskColumn.value = null
  quickTask.value.title = ''
}

const handleDragChange = (evt, columnId) => {
  if (evt.added) {
    const task = evt.added.element
    updateTask({ ...task, status: columnId })
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)),
    'day'
  )
}

const getPriorityColor = (priority) => {
  const colors = {
    High: 'error',
    Medium: 'warning',
    Low: 'success'
  }
  return colors[priority] || 'grey'
}

const togglePriority = (task) => {
  const currentIndex = priorities.indexOf(task.priority || 'Medium')
  const nextIndex = (currentIndex + 1) % priorities.length
  updateTask({ 
    ...task, 
    priority: priorities[nextIndex] 
  })
}

const handleTaskDoubleClick = (taskId) => {
  focusedTaskId.value = focusedTaskId.value === taskId ? null : taskId
}
</script>

<style lang="scss" scoped>
.tasks-page {
  height: calc(100vh - 112px);
  padding: 0;
}

.board-container {
  height: 100%;
  background: #f8fafc;
  border: none;
  border-radius: 24px;
  overflow: hidden;
}

.board-wrapper {
  height: 100%;
  overflow-x: auto;
  display: flex;
  gap: 16px;
  padding: 16px;
  min-width: min-content;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }
}

.column {
  background: white;
  border-radius: 16px;
  width: 320px;
  min-width: 300px;
  height: 100%;
  border: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .column-header {
    position: sticky;
    top: 0;
    z-index: 1;
    
    .column-header-todo {
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
    }
    
    .column-header-inProgress {
      background: linear-gradient(135deg, #0EA5E9, #2563EB);
    }
    
    .column-header-done {
      background: linear-gradient(135deg, #22C55E, #16A34A);
    }
  }
}

.tasks-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  display: flex;
  flex-direction: column;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
}

.draggable-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  gap: 8px;
}

.task-wrapper {
  width: 100%;
}

.task-card {
  width: 100%;
  border-radius: 16px;
  transition: all 0.2s ease;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &.on-hover {
    transform: translateY(-2px);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  &.task-focused {
    position: relative;
    z-index: 2;
    transform: translateY(-2px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(
        125deg,
        rgb(16, 93, 237),    // Pure magenta
        rgb(0, 255, 170),    // Pure cyan
        rgb(255, 0, 128),    // Pure pink
        rgb(55, 14, 236)    
      );
      background-size: 300% 300%;
      animation: shimmer 3s ease infinite;
      z-index: 0;
      opacity: 0.3;         // Control overall opacity here
      overflow: hidden;
    }

    .v-card-text {
      position: relative;
      z-index: 1;
      background: rgba(255, 255, 255, 0.75); // Slightly more transparent
      border-radius: 16px;
    }

    .priority-strip {
      height: 5px;
      opacity: 1;
    }
  }

  .priority-strip {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    
    &.priority-high {
      background: linear-gradient(to right, #ef4444, #dc2626);
    }
    
    &.priority-medium {
      background: linear-gradient(to right, #f59e0b, #d97706);
    }
    
    &.priority-low {
      background: linear-gradient(to right, #22c55e, #16a34a);
    }
  }

  .priority-chip {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    padding: 0 12px;
    height: 24px !important;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }

  .drag-handle {
    cursor: move;
  }

  .v-btn {
    opacity: 0.9;
    
    &:hover {
      opacity: 1;
      transform: scale(1.05);
    }
  }
}

.quick-add-field {
  :deep(.v-field) {
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    
    .v-field__input {
      color: rgba(0, 0, 0, 0.87);
    }
    
    .v-field__outline {
      --v-field-border-opacity: 0.1;
    }
  }
}

.add-task-btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  height: 32px;
  font-size: 0.875rem;
  letter-spacing: 0;
  text-transform: none;
  opacity: 0.9;
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
}

/* Add ghost card styling */
.ghost-card {
  opacity: 0.5;
  background: #edf2f7;
  border: 2px dashed #94a3b8;
  border-radius: 12px;
  margin: 8px;
  height: 80px;
}

.task-count-chip {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  :deep(.v-chip__content) {
    opacity: 1;
  }
}

.text-truncate {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .tasks-page {
    height: calc(100vh - 96px);
  }

  .board-container {
    border-radius: 16px;
  }

  .column {
    min-width: 280px;
    border-radius: 12px;
    
    .column-header {
      border-radius: 12px 12px 0 0;
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style> 