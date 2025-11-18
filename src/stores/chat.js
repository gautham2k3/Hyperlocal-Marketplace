import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockChats, mockMessages } from '@/utils/mockData'

export const useChatStore = defineStore('chat', () => {
  const chats = ref([...mockChats])
  const messages = ref({ ...mockMessages })
  const activeChat = ref(null)

  function getMessagesByChatId(chatId) {
    return messages.value[chatId] || []
  }

  function sendMessage(chatId, message) {
    if (!messages.value[chatId]) {
      messages.value[chatId] = []
    }
    messages.value[chatId].push({
      id: Date.now().toString(),
      ...message,
      timestamp: new Date().toISOString()
    })
  }

  function setActiveChat(chatId) {
    activeChat.value = chatId
  }

  return {
    chats,
    messages,
    activeChat,
    getMessagesByChatId,
    sendMessage,
    setActiveChat
  }
})