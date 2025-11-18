import { ref } from 'vue'

export function useNotification() {
  const notifications = ref([])

  function show(message, type = 'info', duration = 3000) {
    const id = Date.now()
    notifications.value.push({ id, message, type })

    setTimeout(() => {
      remove(id)
    }, duration)
  }

  function remove(id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function success(message) {
    show(message, 'success')
  }

  function error(message) {
    show(message, 'error')
  }

  function warning(message) {
    show(message, 'warning')
  }

  return {
    notifications,
    show,
    success,
    error,
    warning,
    remove
  }
}
