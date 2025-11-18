import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockOrders } from '@/utils/mockData'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([...mockOrders])

  function createOrder(orderData) {
    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      status: 'ordered',
      createdAt: new Date().toISOString()
    }
    orders.value.unshift(newOrder)
    return newOrder
  }

  function getOrderById(id) {
    return orders.value.find(o => o.id === id)
  }

  function updateOrderStatus(id, status) {
    const order = orders.value.find(o => o.id === id)
    if (order) {
      order.status = status
      order.updatedAt = new Date().toISOString()
    }
  }

  return {
    orders,
    createOrder,
    getOrderById,
    updateOrderStatus
  }
})