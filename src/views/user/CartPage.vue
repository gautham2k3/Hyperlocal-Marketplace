<template>
  <div class="cart-page">
    <div class="container">
      <header class="page-header">
        <h1 class="title">Cart</h1>
        <p v-if="cartStore.items.length > 0" class="subtitle">
          {{ cartStore.totalItems }} {{ cartStore.totalItems === 1 ? 'item' : 'items' }}
        </p>
      </header>

      <!-- Empty State -->
      <div v-if="cartStore.items.length === 0" class="empty">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h2 class="empty-title">Your cart is empty</h2>
        <p class="empty-text">Start adding items to get started</p>
        <router-link to="/" class="btn-primary">Browse listings</router-link>
      </div>

      <!-- Cart Content -->
      <div v-else class="cart-layout">
        <div class="items-section">
          <div v-for="item in cartStore.items" :key="item.id" class="item glass-card">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-info">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-price">₹{{ item.price.toLocaleString() }}</p>
              <span class="item-badge" :class="item.type">
                {{ item.type === 'food' ? 'Food' : 'Product' }}
              </span>
            </div>
            
            <div class="item-actions">
              <div class="quantity">
                <button 
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                  class="qty-btn"
                  :disabled="item.quantity <= 1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
                <span class="qty-value">{{ item.quantity }}</span>
                <button 
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                  class="qty-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              </div>
              
              <div class="item-total">₹{{ (item.price * item.quantity).toLocaleString() }}</div>
              
              <button 
                @click="cartStore.removeItem(item.id)" 
                class="remove-btn"
                aria-label="Remove item"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="summary-section">
          <div class="summary-card glass-card">
            <h2 class="summary-title">Summary</h2>
            
            <div class="summary-lines">
              <div class="summary-line">
                <span class="line-label">Subtotal</span>
                <span class="line-value">₹{{ cartStore.subtotal.toLocaleString() }}</span>
              </div>
              
              <!-- Dynamic Platform Fee -->
              <div class="platform-fee-section glass-card-inner">
                <div class="summary-line fee-header">
                  <span class="line-label">Dynamic platform fee</span>
                  <span class="line-value">₹{{ cartStore.platformFees.toLocaleString() }}</span>
                </div>
                
                <div class="fee-breakdown">
                  <div v-for="feeInfo in cartStore.platformFeeBreakdown" :key="feeInfo.itemId" class="fee-item">
                    <div class="fee-item-info">
                      <span class="fee-item-name">{{ feeInfo.itemName }}</span>
                      <span class="fee-tier-badge">{{ feeInfo.feePercent }}% · {{ feeInfo.tier }}</span>
                    </div>
                    <span class="fee-amount">₹{{ feeInfo.totalFee.toFixed(2) }}</span>
                  </div>
                </div>
              </div>
              
              <div class="summary-line">
                <span class="line-label">Service fee</span>
                <span class="line-value">₹{{ cartStore.serviceFee.toLocaleString() }}</span>
              </div>
            </div>

            <!-- Fee Tiers Info -->
            <div class="fee-tiers glass-card-inner">
              <div class="tiers-header">Platform fee tiers</div>
              <div class="tiers-description">Based on item price</div>
              <div class="tier-list">
                <div class="tier">
                  <div class="tier-info">
                    <span class="tier-range">Tier 1: ≤ ₹150</span>
                    <span class="tier-label">Budget-friendly</span>
                  </div>
                  <span class="tier-rate">3%</span>
                </div>
                <div class="tier">
                  <div class="tier-info">
                    <span class="tier-range">Tier 2: ₹150 - ₹500</span>
                    <span class="tier-label">Mid-range</span>
                  </div>
                  <span class="tier-rate">5%</span>
                </div>
                <div class="tier">
                  <div class="tier-info">
                    <span class="tier-range">Tier 3: > ₹500</span>
                    <span class="tier-label">Premium</span>
                  </div>
                  <span class="tier-rate">8%</span>
                </div>
              </div>
            </div>
            
            <div class="summary-total">
              <span class="total-label">Total</span>
              <span class="total-value">₹{{ cartStore.total.toLocaleString() }}</span>
            </div>
            
            <router-link to="/checkout" class="btn-checkout">
              Proceed to checkout
            </router-link>
            
            <button @click="cartStore.clearCart()" class="btn-clear">
              Clear cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-attachment: fixed;
  padding: 80px 0 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  margin-bottom: 40px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.8px;
  color: #000;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* Glass Card Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
}

.glass-card-inner {
  background: rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 12px;
}

/* Empty State */
.empty {
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  margin-bottom: 24px;
  color: #ddd;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin: 0 0 8px 0;
}

.empty-text {
  font-size: 16px;
  color: #666;
  margin: 0 0 32px 0;
}

.btn-primary {
  display: inline-block;
  padding: 14px 32px;
  background: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Cart Layout */
.cart-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: start;
}

/* Items Section */
.items-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  transition: all 0.2s ease;
}

.item:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
}

.item-image {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.02);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin: 0 0 6px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.item-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: rgba(0, 0, 0, 0.05);
  color: #000;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.quantity {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 4px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: #000;
}

.qty-btn:hover:not(:disabled) svg {
  stroke: #fff;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  min-width: 24px;
  text-align: center;
  font-weight: 500;
  font-size: 14px;
}

.item-total {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  min-width: 80px;
  text-align: right;
}

.remove-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #ef4444;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

/* Summary Section */
.summary-section {
  position: sticky;
  top: 80px;
}

.summary-card {
  padding: 24px;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin: 0 0 20px 0;
}

.summary-lines {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.line-label {
  font-size: 14px;
  color: #666;
}

.line-value {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

/* Platform Fee Section */
.platform-fee-section {
  padding: 14px;
  margin: 8px 0;
}

.fee-header {
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.1);
}

.fee-header .line-label,
.fee-header .line-value {
  font-weight: 600;
}

.fee-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.fee-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.fee-item-name {
  font-size: 13px;
  font-weight: 500;
  color: #000;
}

.fee-tier-badge {
  font-size: 10px;
  font-weight: 600;
  color: #666;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 8px;
  border-radius: 4px;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.fee-amount {
  font-size: 13px;
  font-weight: 600;
  color: #000;
}

/* Fee Tiers */
.fee-tiers {
  padding: 16px;
  margin-bottom: 20px;
}

.tiers-header {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #000;
  margin-bottom: 4px;
}

.tiers-description {
  font-size: 11px;
  color: #666;
  margin-bottom: 12px;
}

.tier-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tier {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.tier:hover {
  background: rgba(255, 255, 255, 0.8);
}

.tier-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tier-range {
  font-size: 13px;
  font-weight: 500;
  color: #000;
}

.tier-label {
  font-size: 11px;
  color: #666;
}

.tier-rate {
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.total-label {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}

.total-value {
  font-size: 20px;
  font-weight: 600;
  color: #000;
}

.btn-checkout {
  display: block;
  width: 100%;
  padding: 14px 24px;
  background: #000;
  color: #fff;
  text-align: center;
  text-decoration: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-bottom: 12px;
  border: none;
  cursor: pointer;
}

.btn-checkout:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-clear {
  display: block;
  width: 100%;
  padding: 12px 24px;
  background: rgba(239, 68, 68, 0.05);
  color: #ef4444;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

/* Responsive */
@media (max-width: 968px) {
  .cart-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .summary-section {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-page {
    padding: 60px 0 40px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .item {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .item-info {
    flex-basis: 100%;
    order: -1;
  }
  
  .item-actions {
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
  }
  
  .quantity {
    flex: 1;
  }
  
  .item-total {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
  
  .item-image {
    width: 64px;
    height: 64px;
  }
  
  .summary-card {
    padding: 20px;
  }
}
</style>
