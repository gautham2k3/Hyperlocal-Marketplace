<template>
  <div class="home-page">
    <header class="header">
      <div class="container">
        <div class="header-top">
          <div class="brand-asset">
            <img src="@/assets/hyperlocal_marketplace_logo.png" alt="Logo" class="logo-img" />
            <h1 class="logo">Hyperlocal Marketplace</h1>
          </div>
          <div class="header-actions">
            <button @click="toggleRole" class="role-toggle" v-if="authStore.isAuthenticated">
              {{ authStore.isSeller ? 'Buy' : 'Sell' }}
            </button>
            <router-link to="/cart" class="cart-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
            </router-link>
            <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn-primary">
              Sign in
            </router-link>
            <div v-else class="user-menu">
              <button @click="showUserMenu = !showUserMenu" class="user-btn">
                <div class="user-avatar">{{ authStore.user.name.charAt(0) }}</div>
                <span class="user-name">{{ authStore.user.name }}</span>
              </button>
              <transition name="dropdown-fade">
                <div v-if="showUserMenu" class="dropdown">
                  <router-link to="/profile" class="dropdown-item">Profile</router-link>
                  <router-link to="/seller-dashboard" v-if="authStore.isSeller" class="dropdown-item">Dashboard</router-link>
                  <router-link to="/create-listing" v-if="authStore.isSeller" class="dropdown-item">New Listing</router-link>
                  <div class="divider"></div>
                  <button @click="handleLogout" class="dropdown-item logout">Log out</button>
                </div>
              </transition>
            </div>
          </div>
        </div>
        
        <div class="search-section">
          <div class="search-bar">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              v-model="listingsStore.searchQuery"
              type="text" 
              placeholder="Search food, books, electronics..."
              class="search-input"
            />
            <button 
              class="filter-btn" 
              @click="showFilters = !showFilters" 
              :class="{ active: showFilters }"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="4" y1="12" x2="20" y2="12"/>
                <line x1="4" y1="18" x2="20" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="container main-content">
      <transition name="slide-down">
        <div class="filters-section glass-card" v-if="showFilters">
          <ListingFilters />
        </div>
      </transition>

      <div class="info-bar glass-card">
        <span>{{ listingsStore.maxDistance }}km radius</span>
        <span class="separator">·</span>
        <span>{{ listingsStore.filteredListings.length }} available</span>
      </div>

      <div class="categories">
        <button 
          v-for="cat in categories" 
          :key="cat.value"
          @click="listingsStore.selectedCategory = cat.value"
          :class="['category-chip', { active: listingsStore.selectedCategory === cat.value }]"
        >
          {{ cat.label }}
        </button>
      </div>

      <div class="controls">
        <div class="view-toggle">
          <button 
            @click="viewMode = 'grid'" 
            :class="['view-btn', { active: viewMode === 'grid' }]"
          >
            Grid
          </button>
          <button 
            @click="viewMode = 'map'" 
            :class="['view-btn', { active: viewMode === 'map' }]"
          >
            Map
          </button>
        </div>
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="viewMode === 'grid'" class="listings-grid" key="grid">
          <ListingCard 
            v-for="listing in listingsStore.filteredListings" 
            :key="listing.id"
            :listing="listing"
          />
        </div>

        <div v-else class="map-container glass-card" key="map">
          <MapView 
            :listings="listingsStore.filteredListings" 
            @marker-click="handleMarkerClick"
          />
        </div>
      </transition>

      <div v-if="listingsStore.filteredListings.length === 0" class="empty">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3 class="empty-title">Nothing here</h3>
        <p class="empty-text">Try adjusting your search or filters</p>
        <button @click="resetFilters" class="btn-reset">Clear filters</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useListingsStore } from '@/stores/listings'
import { useCartStore } from '@/stores/cart'
import ListingCard from '@/components/listings/ListingCard.vue'
import ListingFilters from '@/components/listings/ListingFilters.vue'
import MapView from '@/components/map/MapView.vue'

const router = useRouter()
const authStore = useAuthStore()
const listingsStore = useListingsStore()
const cartStore = useCartStore()

const showUserMenu = ref(false)
const showFilters = ref(false)
const viewMode = ref('grid')

const categories = [
  { value: 'all', label: 'All' },
  { value: 'food', label: 'Food' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'books', label: 'Books' },
  { value: 'furniture', label: 'Furniture' }
]

function toggleRole() {
  authStore.toggleSellerMode()
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function resetFilters() {
  listingsStore.selectedCategory = 'all'
  listingsStore.searchQuery = ''
  listingsStore.maxDistance = 5
  listingsStore.priceRange = [0, 50000]
}

function handleMarkerClick(listing) {
  // Handle marker click
}

onMounted(() => {
  console.log('All listings:', listingsStore.listings)
  console.log('Filtered listings:', listingsStore.filteredListings)
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-attachment: fixed;
}

/* Header */
.header {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.brand-asset {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 10px;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin: 0;
  letter-spacing: -0.5px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.role-toggle {
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-toggle:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.cart-link {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  color: #000;
  text-decoration: none;
  transition: all 0.2s ease;
}

.cart-link:hover {
  background: rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #000;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.btn-primary {
  padding: 8px 20px;
  background: #000;
  color: #fff;
  text-decoration: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 4px 4px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.8);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 10px 14px;
  color: #000;
  text-decoration: none;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.dropdown-item.logout {
  color: #ef4444;
}

.divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin: 8px 0;
}

/* Search Section */
.search-section {
  padding-bottom: 16px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  padding: 4px;
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.search-icon {
  margin-left: 14px;
  color: #666;
}

.search-input {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: transparent;
  font-size: 15px;
  outline: none;
  color: #000;
}

.search-input::placeholder {
  color: #999;
}

.filter-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover,
.filter-btn.active {
  background: #000;
  color: #fff;
}

.filter-btn:hover svg,
.filter-btn.active svg {
  stroke: #fff;
}

/* Main Content */
.main-content {
  padding: 32px 24px 60px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
}

.filters-section {
  margin-bottom: 24px;
  padding: 24px;
}

.info-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 14px 24px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.separator {
  color: #ddd;
}

/* Categories */
.categories {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.categories::-webkit-scrollbar {
  display: none;
}

.category-chip {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  transition: all 0.2s ease;
}

.category-chip:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.category-chip.active {
  background: #000;
  color: #fff;
  border-color: #000;
}

/* Controls */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.view-toggle {
  display: inline-flex;
  padding: 4px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.view-btn {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: #000;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Grid */
.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

/* Map */
.map-container {
  height: 600px;
  overflow: hidden;
  margin-bottom: 24px;
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
  margin-bottom: 8px;
}

.empty-text {
  font-size: 15px;
  color: #666;
  margin-bottom: 24px;
}

.btn-reset {
  padding: 12px 24px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animations */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .header-top {
    flex-wrap: wrap;
  }
  
  .user-name {
    display: none;
  }
  
  .listings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
  
  .main-content {
    padding: 24px 16px 40px;
  }
}
</style>
