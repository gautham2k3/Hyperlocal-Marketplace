import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() => 
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )

  // Dynamic Platform Fee based on Selling Price (per item)
  const platformFees = computed(() => {
    return items.value.reduce((sum, item) => {
      const sellingPrice = item.price
      let feePercent = 0
      
      // Tiered platform fee based on selling price
      if (sellingPrice <= 150) {
        feePercent = 3  // 3% for items ≤ ₹150
      } else if (sellingPrice <= 500) {
        feePercent = 5  // 5% for items ₹150-₹500
      } else {
        feePercent = 8  // 8% for items > ₹500
      }
      
      return sum + (sellingPrice * item.quantity * feePercent / 100)
    }, 0)
  })

  // Get platform fee breakdown for display
  const platformFeeBreakdown = computed(() => {
    return items.value.map(item => {
      const sellingPrice = item.price
      let feePercent = 0
      let tier = ''
      
      if (sellingPrice <= 150) {
        feePercent = 3
        tier = 'Tier 1 (≤₹150)'
      } else if (sellingPrice <= 500) {
        feePercent = 5
        tier = 'Tier 2 (₹150-₹500)'
      } else {
        feePercent = 8
        tier = 'Tier 3 (>₹500)'
      }
      
      return {
        itemId: item.id,
        itemName: item.name,
        price: sellingPrice,
        quantity: item.quantity,
        feePercent,
        tier,
        totalFee: (sellingPrice * item.quantity * feePercent / 100)
      }
    })
  })

  // Buyer Service Fee (fixed ₹2 per order)
  const serviceFee = computed(() => {
    return items.value.length > 0 ? 2 : 0
  })

  const total = computed(() => 
    subtotal.value + platformFees.value + serviceFee.value
  )

  function addItem(listing, quantity = 1) {
    const existingItem = items.value.find(item => item.id === listing.id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        ...listing,
        quantity
      })
    }
  }

  function removeItem(id) {
    items.value = items.value.filter(item => item.id !== id)
  }

  function updateQuantity(id, quantity) {
    const item = items.value.find(item => item.id === id)
    if (item) {
      if (quantity <= 0) {
        removeItem(id)
      } else {
        item.quantity = quantity
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    subtotal,
    platformFees,
    platformFeeBreakdown,
    serviceFee,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  }
})
