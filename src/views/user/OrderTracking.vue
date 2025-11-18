<template>
  <div class="order-tracking">
    <div class="container">
      <h1>📦 Track Your Order</h1>
      
      <div v-if="order" class="order-details">
        <div class="order-header">
          <div>
            <h2>Order #{{ order.id }}</h2>
            <p>Placed on {{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="status-badge" :class="order.status">
            {{ order.status.toUpperCase() }}
          </div>
        </div>
        
        <div class="tracking-timeline">
          <div class="timeline-item" :class="{ active: isStepActive('ordered') }">
            <div class="timeline-icon">📝</div>
            <div class="timeline-content">
              <h3>Order Placed</h3>
              <p>Your order has been received</p>
            </div>
          </div>
          
          <div class="timeline-item" :class="{ active: isStepActive('accepted') }">
            <div class="timeline-icon">✅</div>
            <div class="timeline-content">
              <h3>Accepted</h3>
              <p>Seller confirmed your order</p>
            </div>
          </div>
          
          <div class="timeline-item" :class="{ active: isStepActive('ready') }">
            <div class="timeline-icon">🍳</div>
            <div class="timeline-content">
              <h3>Preparing</h3>
              <p>Your order is being prepared</p>
            </div>
          </div>
          
          <div class="timeline-item" :class="{ active: isStepActive('picked') }">
            <div class="timeline-icon">🚚</div>
            <div class="timeline-content">
              <h3>On the Way</h3>
              <p>Order picked up for delivery</p>
            </div>
          </div>
          
          <div class="timeline-item" :class="{ active: isStepActive('delivered') }">
            <div class="timeline-icon">🎉</div>
            <div class="timeline-content">
              <h3>Delivered</h3>
              <p>Order delivered successfully</p>
            </div>
          </div>
        </div>
        
        <div class="order-items">
          <h3>Order Items</h3>
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <img :src="item.image" :alt="item.name" />
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p>Quantity: {{ item.quantity }}</p>
            </div>
            <div class="item-price">
              ₹{{ item.price * item.quantity }}
            </div>
          </div>
        </div>
        
        <div class="order-total">
          <div class="total-row">
            <span>Total Amount</span>
            <span>₹{{ order.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      
      <div v-else class="no-order">
        <p>Order not found</p>
        <router-link to="/" class="btn btn-primary">Go to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'

const route = useRoute()
const ordersStore = useOrdersStore()

const order = computed(() => ordersStore.getOrderById(route.params.id))

const statusFlow = ['ordered', 'accepted', 'ready', 'picked', 'delivered']

function isStepActive(step) {
  if (!order.value) return false
  const currentIndex = statusFlow.indexOf(order.value.status)
  const stepIndex = statusFlow.indexOf(step)
  return stepIndex <= currentIndex
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.order-tracking {
  min-height: 100vh;
  padding: 40px 0;
  background: #f5f5f5;
}

.order-details {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin-top: 30px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 30px;
}

.status-badge {
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
  color: white;
}

.status-badge.ordered { background: #2196F3; }
.status-badge.accepted { background: #4CAF50; }
.status-badge.ready { background: #FF9800; }
.status-badge.picked { background: #9C27B0; }
.status-badge.delivered { background: #4CAF50; }

.tracking-timeline {
  margin: 40px 0;
}

.timeline-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  opacity: 0.3;
  position: relative;
  margin-left: 20px;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 60px;
  width: 2px;
  height: calc(100% + 20px);
  background: #e0e0e0;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-item.active {
  opacity: 1;
}

.timeline-icon {
  font-size: 32px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  border: 3px solid #e0e0e0;
}

.timeline-item.active .timeline-icon {
  border-color: #4CAF50;
  background: #E8F5E9;
}

.timeline-content h3 {
  margin-bottom: 5px;
}

.timeline-content p {
  color: #666;
  font-size: 14px;
}

.order-items {
  margin-top: 40px;
}

.order-items h3 {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
}

.order-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin-bottom: 5px;
}

.item-price {
  font-weight: bold;
  font-size: 18px;
}

.order-total {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: bold;
}

.no-order {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  margin-top: 30px;
}

.no-order p {
  font-size: 18px;
  margin-bottom: 20px;
}
</style>
