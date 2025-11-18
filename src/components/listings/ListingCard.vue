<template>
  <div class="card" @click="goToDetails">
    <div class="image">
      <img :src="listing.image" :alt="listing.name" />
      <div class="overlay">
        <span class="badge" :class="getBadgeClass">{{ listing.seller.badge }}</span>
        <span class="distance">{{ listing.distance }}km</span>
      </div>
    </div>
    
    <div class="content">
      <div class="header">
        <h3 class="title">{{ listing.name }}</h3>
        <div class="meta">
          <span class="rating">{{ listing.rating }}</span>
          <span class="reviews">{{ listing.reviews }}</span>
        </div>
      </div>
      
      <p class="description">{{ truncateDescription }}</p>
      
      <div class="footer">
        <span class="price">₹{{ listing.price.toLocaleString() }}</span>
        <button @click.stop="quickAdd" class="add-btn">
          Add to cart
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  listing: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()

const truncateDescription = computed(() => {
  return props.listing.description.length > 100
    ? props.listing.description.substring(0, 100) + '...'
    : props.listing.description
})

const getBadgeClass = computed(() => {
  return props.listing.seller.badge.toLowerCase().replace(/\s+/g, '-')
})

function goToDetails() {
  router.push(`/listing/${props.listing.id}`)
}

function quickAdd() {
  cartStore.addItem(props.listing, 1)
  // Consider using a toast notification instead of alert
  alert('Added to cart!')
}
</script>

<style scoped>
.card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: #000;
  transform: translateY(-2px);
}

.card:active {
  transform: translateY(0);
}

.image {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #fafafa;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover .image img {
  transform: scale(1.03);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%);
  opacity: 1;
}



.badge {
  padding: 6px 12px;
  background: #000;
  color: #fff;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge.top-rated {
  background: #000;
}

.badge.hygiene-checked {
  background: #000;
}

.badge.verified {
  background: #000;
}

.distance {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #000;
}

.content {
  padding: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
  line-height: 1.3;
  margin: 0;
  letter-spacing: -0.2px;
  flex: 1;
}

.meta {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.rating {
  font-size: 14px;
  font-weight: 600;
  color: #000;
}

.rating::before {
  content: '★';
  margin-right: 2px;
}

.reviews {
  font-size: 13px;
  color: #999;
}

.description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.price {
  font-size: 20px;
  font-weight: 600;
  color: #000;
  letter-spacing: -0.5px;
}

.add-btn {
  padding: 10px 20px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.add-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.add-btn:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .content {
    padding: 14px;
  }
  
  .title {
    font-size: 15px;
  }
  
  .price {
    font-size: 18px;
  }
  
  .add-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
}
</style>
