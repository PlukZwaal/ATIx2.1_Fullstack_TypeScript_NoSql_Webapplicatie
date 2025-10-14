<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-3"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'rounded-xl shadow-lg border overflow-hidden transform transition-all duration-300',
            getToastClasses(toast.type)
          ]"
        >
          <div class="p-4 flex items-center gap-3">
            <div class="flex-shrink-0">
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center', getIconBackgroundClasses(toast.type)]">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="toast.type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  <path v-else-if="toast.type === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  <path v-else-if="toast.type === 'warning'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p :class="['font-medium text-sm', getTextClasses(toast.type)]">
                {{ toast.message }}
              </p>
            </div>
            <button
              @click="removeToast(toast.id)"
              :class="['flex-shrink-0 rounded-full p-1 hover:bg-opacity-20 transition-colors', getCloseButtonClasses(toast.type)]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()

/**
 * Geeft de CSS classes terug voor de toast achtergrond gebaseerd op type
 * @param {string} type - Type van de toast ('success', 'error', 'warning', 'info')
 * @returns {string} CSS classes voor de toast achtergrond
 */
const getToastClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
    case 'error':
      return 'bg-gradient-to-r from-red-100 to-red-50 border-red-300'
    case 'warning':
      return 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'
    default:
      return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
  }
}

/**
 * Geeft de CSS classes terug voor de icoon achtergrond gebaseerd op type
 * @param {string} type - Type van de toast ('success', 'error', 'warning', 'info')
 * @returns {string} CSS classes voor de icoon achtergrond
 */
const getIconBackgroundClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-r from-green-500 to-emerald-600'
    case 'error':
      return 'bg-gradient-to-r from-red-500 to-red-600'
    case 'warning':
      return 'bg-gradient-to-r from-amber-400 to-yellow-500'
    default:
      return 'bg-gradient-to-r from-blue-400 to-indigo-500'
  }
}

/**
 * Geeft de CSS classes terug voor de tekst kleur gebaseerd op type
 * @param {string} type - Type van de toast ('success', 'error', 'warning', 'info')
 * @returns {string} CSS classes voor de tekst kleur
 */
const getTextClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-800'
    case 'error':
      return 'text-red-900'
    case 'warning':
      return 'text-amber-800'
    default:
      return 'text-blue-800'
  } 
}

/**
 * Geeft de CSS classes terug voor de sluitknop gebaseerd op type
 * @param {string} type - Type van de toast ('success', 'error', 'warning', 'info')
 * @returns {string} CSS classes voor de sluitknop
 */
const getCloseButtonClasses = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-500 hover:bg-green-500'
    case 'error':
      return 'text-red-600 hover:bg-red-600'
    case 'warning':
      return 'text-amber-500 hover:bg-amber-500'
    default:
      return 'text-blue-500 hover:bg-blue-500'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>