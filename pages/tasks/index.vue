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
                  class="ml-2"
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
                      :class="{ 'on-hover': isHovering }"
                    >
                      <v-card-text class="pa-3">
                        <div class="d-flex justify-space-between align-center">
                          <div class="text-subtitle-1 text-truncate">{{ task.title }}</div>
                          <v-icon
                            v-if="isHovering"
                            size="small"
                            class="ms-2"
                            color="grey"
                          >
                            mdi-drag
                          </v-icon>
                        </div>
                        <div class="mt-1 d-flex align-center">
                          <v-icon
                            size="14"
                            :color="column.color"
                            class="me-1"
                          >
                            mdi-clock-outline
                          </v-icon>
                          <span class="text-caption text-medium-emphasis">
                            {{ formatDate(task.createdAt) }}
                          </span>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { useTasks } from '../../composables/useTasks'

const tasksListRef = ref(null)
const { tasks, addTask, updateTask } = useTasks()

const newTaskColumn = ref(null)
const quickTask = ref({
  title: '',
})

const columns = [
  { 
    id: 'todo', 
    name: 'To Do', 
    icon: 'mdi-format-list-checks', 
    color: 'primary',
    iconColor: 'white',
    chipColor: 'rgba(255,255,255,0.9)',
    gradient: 'linear-gradient(135deg, #4F46E5, #7C3AED)'
  },
  { 
    id: 'inProgress', 
    name: 'In Progress', 
    icon: 'mdi-progress-clock', 
    color: 'info',
    iconColor: 'white',
    chipColor: 'rgba(255,255,255,0.9)',
    gradient: 'linear-gradient(135deg, #0EA5E9, #2563EB)'
  },
  { 
    id: 'done', 
    name: 'Done', 
    icon: 'mdi-check-circle', 
    color: 'success',
    iconColor: 'white',
    chipColor: 'rgba(255,255,255,0.9)',
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
    })
    
    // Scroll to top after adding new task
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
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
  margin: 0; /* Remove margin */
  
  &.on-hover {
    transform: translateY(-2px);
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
</style> 