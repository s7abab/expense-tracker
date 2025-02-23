<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500"
  >
    <v-card>
      <v-card-title class="text-h5 pa-4">
        New Task
      </v-card-title>

      <v-card-text class="pa-4">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="task.title"
            label="Title"
            variant="outlined"
            required
          />

          <v-textarea
            v-model="task.description"
            label="Description"
            variant="outlined"
            rows="3"
          />

          <v-select
            v-model="task.priority"
            :items="priorities"
            label="Priority"
            variant="outlined"
          />

          <v-select
            v-model="task.assignee"
            :items="team"
            label="Assignee"
            item-title="name"
            item-value="id"
            variant="outlined"
          />

          <v-text-field
            v-model="task.dueDate"
            label="Due Date"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="$emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          @click="handleSubmit"
        >
          Create Task
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue', 'save'])

const priorities = ['High', 'Medium', 'Low']
const team = [
  { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
]

const task = ref({
  title: '',
  description: '',
  priority: 'Medium',
  assignee: null,
  dueDate: new Date().toISOString().split('T')[0],
  status: 'todo',
})

const handleSubmit = () => {
  emit('save', { ...task.value, id: Date.now() })
  task.value = {
    title: '',
    description: '',
    priority: 'Medium',
    assignee: null,
    dueDate: new Date().toISOString().split('T')[0],
    status: 'todo',
  }
}
</script> 