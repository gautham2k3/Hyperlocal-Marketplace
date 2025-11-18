<template>
  <div class="checkout-page">
    <div class="container">
      <h1>💳 Checkout</h1>
      
      <div class="checkout-grid">
        <div class="checkout-form">
          <h2>Delivery Details</h2>
          <form @submit.prevent="handleCheckout">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="form.name" type="text" class="form-input" required />
            </div>
            
            <div class="form-group">
              <label>Phone Number</label>
              <input v-model="form.phone" type="tel" class="form-input" required />
            </div>
            
            <div class="form-group">
              <label>Delivery Address</label>
              <textarea v-model="form.address" class="form-textarea" required></textarea>
            </div>
            
            <div class="form-group">
              <label>Payment Method</label>
              <select v-model="form.paymentMethod" class="form-select">
                <option value="razorpay">Razorpay (UPI/Card)</option>
                <option value="cash">Cash on Delivery</option>
              </select>
            </div>
            
            <button type="submit" class="btn btn-primary">Place Order</button>
          </form>
        </div>
        
        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="summary-items">
            <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span>₹{{ item.price * item.quantity }}</span>
            </div>
          </div>
          <div class="summary-total">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>₹{{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Platform Fees</span>
              <span>₹{{ cartStore.platformFees.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Service Fee</span>
              <span>₹{{ cartStore.serviceFee.toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <strong>Total</strong>
              <strong>₹{{ cartStore.total.toFixed(2) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'

const router = useRouter()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()

const form = ref({
  name: '',
  phone: '',
  address: '',
  paymentMethod: 'razorpay'
})

function handleCheckout() {
  const order = ordersStore.createOrder({
    items: [...cartStore.items],
    total: cartStore.total,
    deliveryAddress: form.value.address,
    paymentMethod: form.value.paymentMethod
  })
  
  cartStore.clearCart()
  alert('Order placed successfully!')
  router.push(`/order/${order.id}`)
}
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  padding: 40px 0;
  background: #f5f5f5;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-top: 30px;
}

.checkout-form,
.order-summary {
  background: white;
  padding: 30px;
  border-radius: 12px;
}

.checkout-form h2,
.order-summary h2 {
  margin-bottom: 20px;
}

.summary-items {
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-total {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.summary-row.total {
  font-size: 20px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
}
</style>
