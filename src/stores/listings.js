import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockListings } from '@/utils/mockData'

export const useListingsStore = defineStore('listings', () => {
  const listings = ref([...mockListings])
  const selectedCategory = ref('all')
  const searchQuery = ref('')
  const maxDistance = ref(5)
  const priceRange = ref([0, 50000])
  const sortBy = ref('distance')

  const filteredListings = computed(() => {
    let filtered = [...listings.value]

    // Filter by category
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(l => {
        // If filtering by 'food', match type === 'food'
        if (selectedCategory.value === 'food') {
          return l.type === 'food'
        }
        // For product categories (electronics, books, furniture, clothing)
        // Match by category field
        return l.category === selectedCategory.value && l.type === 'product'
      })
    }

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(l => 
        l.name.toLowerCase().includes(query) || 
        l.description.toLowerCase().includes(query)
      )
    }

    // Distance and price filter
    filtered = filtered.filter(l => 
      l.distance <= maxDistance.value &&
      l.price >= priceRange.value[0] &&
      l.price <= priceRange.value[1]
    )

    // Sorting
    if (sortBy.value === 'distance') {
      filtered.sort((a, b) => a.distance - b.distance)
    } else if (sortBy.value === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy.value === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy.value === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered
  })

  function getListingById(id) {
    return listings.value.find(l => l.id === id)
  }

  function addListing(listing) {
    const newListing = {
      ...listing,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: listing.status || 'draft',
      seller: {
        id: 'current-user',
        name: 'Current User',
        rating: 0,
        reviews: 0,
        badge: 'New',
        phone: '+91-9999999999'
      },
      distance: 0.5,
      rating: 0,
      reviews: 0,
      lat: 30.7333,
      lng: 76.7794
    }
    listings.value.push(newListing)
    return newListing
  }

  function updateListing(id, updates) {
    const index = listings.value.findIndex(l => l.id === id)
    if (index !== -1) {
      listings.value[index] = { ...listings.value[index], ...updates }
    }
  }

  function deleteListing(id) {
    listings.value = listings.value.filter(l => l.id !== id)
  }

  return {
    listings,
    filteredListings,
    selectedCategory,
    searchQuery,
    maxDistance,
    priceRange,
    sortBy,
    getListingById,
    addListing,
    updateListing,
    deleteListing
  }
})
