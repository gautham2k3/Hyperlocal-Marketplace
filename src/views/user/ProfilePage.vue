<template>
  <div class="profile-page">
    <div class="container">
      <h1>👤 My Profile</h1>
      
      <div class="profile-grid">
        <div class="profile-sidebar">
          <div class="profile-avatar">
            {{ authStore.user?.name?.[0] || 'U' }}
          </div>
          <h2>{{ authStore.user?.name }}</h2>
          <p>{{ authStore.user?.phone }}</p>
          <div class="profile-badges">
            <span v-if="authStore.isSeller" class="badge badge-success">Seller</span>
            <span v-if="authStore.isAdmin" class="badge badge-warning">Admin</span>
          </div>
        </div>
        
        <div class="profile-content">
          <div class="profile-section">
            <h3>Personal Information</h3>
            <form @submit.prevent="updateProfile">
              <div class="form-group">
                <label>Full Name</label>
                <input v-model="form.name" type="text" class="form-input" />
              </div>
              
              <div class="form-group">
                <label>Email</label>
                <input v-model="form.email" type="email" class="form-input" />
              </div>
              
              <div class="form-group">
                <label>Phone</label>
                <input v-model="form.phone" type="tel" class="form-input" disabled />
              </div>
              
              <button type="submit" class="btn btn-primary">Update Profile</button>
            </form>
          </div>
          
          <div class="profile-section">
            <h3>My Orders</h3>
            <div v-if="ordersStore.orders.length > 0" class="orders-list">
              <div v-for="order in ordersStore.orders" :key="order.id" class="order-card">
                <div class="order-header">
                  <span>Order #{{ order.id }}</span>
                  <span class="status-badge" :class="order.status">{{ order.status }}</span>
                </div>
                <p>Total: ₹{{ order.total.toFixed(2) }}</p>
                <router-link :to="`/order/${order.id}`" class="btn btn-outline">Track Order</router-link>
              </div>
            </div>
            <p v-else>No orders yet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'

const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const form = ref({
  name: '',
  email: '',
  phone: ''
})

onMounted(() => {
  if (authStore.user) {
    form.value.name = authStore.user.name || ''
    form.value.phone = authStore.user.phone || ''
    form.value.email = authStore.user.email || ''
  }
})

function updateProfile() {
  alert('Profile updated successfully!')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 40px 0;
  background: #f5f5f5;
}

.profile-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  margin-top: 30px;
}

.profile-sidebar {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  height: fit-content;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  margin: 0 auto 20px;
}

.profile-sidebar h2 {
  margin-bottom: 10px;
}

.profile-sidebar p {
  color: #666;
  margin-bottom: 15px;
}

.profile-badges {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
}

.profile-section h3 {
  margin-bottom: 20px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.status-badge.ordered { background: #2196F3; }
.status-badge.ready { background: #FF9800; }
.status-badge.delivered { background: #4CAF50; }

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}
</style>
