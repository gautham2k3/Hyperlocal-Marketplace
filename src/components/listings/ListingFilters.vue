<template>
  <div class="filters">
    <h3>Filters</h3>
    
    <div class="filter-group">
      <label>Sort By</label>
      <select v-model="listingsStore.sortBy">
        <option value="distance">Distance</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Rating</option>
      </select>
    </div>

    <div class="filter-group">
      <label>Maximum Distance: {{ listingsStore.maxDistance }} km</label>
      <input 
        v-model="listingsStore.maxDistance" 
        type="range" 
        min="1" 
        max="8" 
        step="1"
      />
    </div>

    <div class="filter-group">
      <label>Price Range</label>
      <div class="price-inputs">
        <input v-model="minPrice" type="number" placeholder="Min" />
        <span>-</span>
        <input v-model="maxPrice" type="number" placeholder="Max" />
      </div>
    </div>

    <button @click="resetFilters" class="reset-btn">Reset All Filters</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useListingsStore } from '@/stores/listings'

const listingsStore = useListingsStore()

const minPrice = computed({
  get: () => listingsStore.priceRange[0],
  set: (value) => {
    listingsStore.priceRange[0] = Number(value) || 0
  }
})

const maxPrice = computed({
  get: () => listingsStore.priceRange[1],
  set: (value) => {
    listingsStore.priceRange[1] = Number(value) || 50000
  }
})

function resetFilters() {
  listingsStore.selectedCategory = 'all'
  listingsStore.searchQuery = ''
  listingsStore.maxDistance = 5
  listingsStore.priceRange = [0, 50000]
  listingsStore.sortBy = 'distance'
}
</script>

<style scoped>
.filters {
  padding: 20px;
}

.filters h3 {
  margin-bottom: 20px;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.filter-group select,
.filter-group input[type="range"] {
  width: 100%;
  padding: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.price-inputs {
  display: flex;
  gap: 10px;
  align-items: center;
}

.price-inputs input {
  flex: 1;
  padding: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.reset-btn {
  width: 100%;
  padding: 10px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}
</style>
