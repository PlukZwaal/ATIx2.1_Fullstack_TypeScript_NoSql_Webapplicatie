import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const toasts = ref<Toast[]>([])
let toastIdCounter = 0

export const useToast = () => {
  const addToast = (message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = ++toastIdCounter
    const toast: Toast = {
      id,
      message,
      type,
      duration
    }
    
    toasts.value.push(toast)
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (message: string) => addToast(message, 'success', 5000)
  const error = (message: string) => addToast(message, 'error', 7000)
  const info = (message: string) => addToast(message, 'info', 4000)
  const warning = (message: string) => addToast(message, 'warning', 6000)
  
  return {
    toasts,
    removeToast,
    success,
    error,
    info,
    warning
  }
}