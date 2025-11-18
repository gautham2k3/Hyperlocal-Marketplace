<template>
  <div class="listing-details" v-if="listing">
    <div class="container">
      <!-- Navigation -->
      <button @click="goBack" class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back
      </button>
      
      <!-- Main Content -->
      <div class="content-grid">
        <!-- Image Section -->
        <div class="image-section">
          <div class="image-wrapper">
            <img :src="listing.image" :alt="listing.name" class="main-image" />
            <div class="badge" :class="getBadgeClass(listing.seller.badge)">
              {{ listing.seller.badge }}
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <div class="header">
            <div class="title-row">
              <h1 class="title">{{ listing.name }}</h1>
              <div class="rating-compact">
                <span class="rating-value">{{ listing.rating }}</span>
                <span class="rating-icon">★</span>
                <span class="reviews-count">({{ listing.reviews }})</span>
              </div>
            </div>
            <div class="price">₹{{ listing.price.toLocaleString() }}</div>
          </div>

          <p class="description">{{ listing.description }}</p>

          <!-- Type-specific Details -->
          <div class="details-section">
            <h2 class="section-title">Details</h2>
            
            <div v-if="listing.type === 'food'" class="details-list">
              <div class="detail-row">
                <span class="detail-label">Available hours</span>
                <span class="detail-value">{{ listing.availableFrom }} - {{ listing.availableTo }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Quantity</span>
                <span class="detail-value">{{ listing.quantity }} portions</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Delivery radius</span>
                <span class="detail-value">{{ listing.deliveryRadius }}km</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Ingredients</span>
                <span class="detail-value">{{ listing.ingredients.join(', ') }}</span>
              </div>
              <div v-if="listing.allergens?.length" class="detail-row allergens">
                <span class="detail-label">Allergens</span>
                <span class="detail-value">{{ listing.allergens.join(', ') }}</span>
              </div>
            </div>

            <div v-else class="details-list">
              <div class="detail-row">
                <span class="detail-label">Condition</span>
                <span class="detail-value">{{ listing.condition }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Category</span>
                <span class="detail-value">{{ listing.category }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Pickup location</span>
                <span class="detail-value">{{ listing.pickupLocation }}</span>
              </div>
            </div>
          </div>

          <!-- Seller Info -->
          <div class="seller-section">
            <h2 class="section-title">Seller</h2>
            <div class="seller-card">
              <div class="seller-avatar">{{ listing.seller.name.charAt(0) }}</div>
              <div class="seller-details">
                <div class="seller-name">{{ listing.seller.name }}</div>
                <div class="seller-meta">
                  <span class="seller-rating">{{ listing.seller.rating }} ★</span>
                  <span class="separator">·</span>
                  <span class="seller-reviews">{{ listing.seller.reviews }} reviews</span>
                  <span class="separator">·</span>
                  <span class="seller-distance">{{ listing.distance }}km away</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions">
            <div class="quantity-selector">
              <button 
                @click="quantity > 1 && quantity--" 
                class="qty-btn"
                :disabled="quantity <= 1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <span class="qty-value">{{ quantity }}</span>
              <button @click="quantity++" class="qty-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
            
            <button @click="addToCart" class="btn-add">
              Add to cart
            </button>
            
            <button @click="openChat" class="btn-chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Chat
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <h2 class="reviews-title">Reviews</h2>
        <div class="reviews-list">
          <div class="review" v-for="i in 3" :key="i">
            <div class="review-header">
              <div class="reviewer-avatar">C{{ i }}</div>
              <div class="reviewer-info">
                <div class="reviewer-name">Customer {{ i }}</div>
                <div class="reviewer-meta">
                  <span class="review-rating">{{ 4 + Math.random() * 1 | 0 }} ★</span>
                  <span class="separator">·</span>
                  <span class="review-date">{{ Math.floor(Math.random() * 30) }} days ago</span>
                </div>
              </div>
            </div>
            <p class="review-text">Great quality! Highly recommended. Would definitely buy again.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListingsStore } from '@/stores/listings'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const router = useRouter()
const listingsStore = useListingsStore()
const cartStore = useCartStore()

const quantity = ref(1)
const listing = computed(() => listingsStore.getListingById(route.params.id))

function goBack() {
  router.back()
}

function addToCart() {
  if (listing.value) {
    cartStore.addItem(listing.value, quantity.value)
    alert('Added to cart!')
  }
}

function openChat() {
  router.push(`/chat/${listing.value.seller.id}`)
}

function getBadgeClass(badge) {
  return badge.toLowerCase().replace(/\s+/g, '-')
}
</script>

<style scoped>
.listing-details {
  min-height: 100vh;
  background: #fff;
  padding: 80px 0 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  margin-bottom: 32px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: #f5f5f5;
  border-color: #000;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;
}

/* Image Section */
.image-section {
  position: sticky;
  top: 80px;
  height: fit-content;
}

.image-wrapper {
  position: relative;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  background: #f5f5f5;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 16px;
  background: #000;
  color: #fff;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Info Section */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.header {
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e5e5;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 16px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.8px;
  color: #000;
  margin: 0;
  flex: 1;
}

.rating-compact {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  white-space: nowrap;
}

.rating-value {
  font-weight: 600;
  color: #000;
}

.rating-icon {
  color: #000;
}

.reviews-count {
  color: #666;
}

.price {
  font-size: 28px;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.5px;
}

.description {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

/* Details Section */
.details-section,
.seller-section {
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e5e5;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #000;
  margin: 0 0 16px 0;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 15px;
}

.detail-label {
  color: #666;
  flex-shrink: 0;
}

.detail-value {
  color: #000;
  font-weight: 500;
  text-align: right;
}

.detail-row.allergens .detail-value {
  color: #ef4444;
}

/* Seller Section */
.seller-card {
  display: flex;
  gap: 16px;
  align-items: center;
}

.seller-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
}

.seller-details {
  flex: 1;
}

.seller-name {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
}

.seller-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.seller-rating {
  color: #000;
  font-weight: 500;
}

.separator {
  color: #ddd;
}

/* Actions */
.actions {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  padding-top: 8px;
}

.quantity-selector {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 4px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
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
  min-width: 32px;
  text-align: center;
  font-weight: 600;
  font-size: 15px;
}

.btn-add {
  padding: 12px 32px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-chat {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #fff;
  color: #000;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-chat:hover {
  background: #f5f5f5;
  border-color: #000;
}

/* Reviews Section */
.reviews-section {
  background: #fafafa;
  border-radius: 16px;
  padding: 40px;
}

.reviews-title {
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin: 0 0 24px 0;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review {
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e5e5;
}

.review:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.review-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e5e5;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  font-size: 15px;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
}

.reviewer-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.review-rating {
  color: #000;
  font-weight: 500;
}

.review-text {
  font-size: 15px;
  line-height: 1.6;
  color: #666;
  margin: 0;
}

/* Responsive */
@media (max-width: 968px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .image-section {
    position: static;
  }
  
  .actions {
    grid-template-columns: 1fr;
  }
  
  .quantity-selector {
    justify-self: start;
  }
}

@media (max-width: 640px) {
  .listing-details {
    padding: 60px 0 40px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .price {
    font-size: 24px;
  }
  
  .reviews-section {
    padding: 24px;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 4px;
  }
  
  .detail-value {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
}
</style>
