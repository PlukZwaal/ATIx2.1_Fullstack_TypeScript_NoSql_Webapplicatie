import { ref } from 'vue'
import { TOAST_DURATION } from '../constants'

// Type definitie voor een toast melding
export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

// Lijst met alle actieve toasts
const toasts = ref<Toast[]>([])
let toastIdCounter = 0

// Composable voor toast meldingen
export const useToast = () => {
  // Voeg nieuwe toast toe
  const addToast = (message: string, type: Toast['type'] = 'success', duration: number = TOAST_DURATION.SUCCESS) => {
    const id = ++toastIdCounter
    const toast: Toast = {
      id,
      message,
      type,
      duration
    }
    
    toasts.value.push(toast)
    
    // Verwijder toast automatisch na duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  // Verwijder toast
  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  // Shortcut functies voor verschillende types
  const success = (message: string) => addToast(message, 'success', TOAST_DURATION.SUCCESS)
  const error = (message: string) => addToast(message, 'error', TOAST_DURATION.ERROR)
  
  return {
    toasts,
    removeToast,
    success,
    error
  }
}