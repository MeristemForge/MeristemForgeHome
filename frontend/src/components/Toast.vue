<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  type?: 'error' | 'success'
}>()

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

watch(
  () => props.message,
  () => {
    visible.value = true
    setTimeout(() => {
      visible.value = false
      emit('close')
    }, 3000)
  },
  { immediate: true }
)
</script>

<template>
  <Transition name="toast">
    <div v-if="visible" class="toast" :class="type || 'error'">
      <span>{{ message }}</span>
      <button class="toast-close" @click="visible = false; emit('close')">×</button>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 300;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 400px;
}

.toast.error {
  background: var(--danger);
  color: #fff;
}

.toast.success {
  background: var(--accent);
  color: #000;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  line-height: 1;
}

.toast-close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
