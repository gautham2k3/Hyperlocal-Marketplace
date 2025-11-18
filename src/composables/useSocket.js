import { ref, onMounted, onUnmounted } from 'vue'

export function useSocket(url = 'http://localhost:3001') {
  const socket = ref(null)
  const connected = ref(false)

  function connect() {
    // Placeholder for Socket.io connection
    console.log('Socket connection would be established here')
    connected.value = true
  }

  function disconnect() {
    if (socket.value) {
      console.log('Socket disconnected')
      connected.value = false
    }
  }

  function emit(event, data) {
    console.log('Emit event:', event, data)
  }

  function on(event, callback) {
    console.log('Listen to event:', event)
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    connected,
    emit,
    on,
    connect,
    disconnect
  }
}
