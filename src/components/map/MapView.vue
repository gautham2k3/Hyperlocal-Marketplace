<template>
  <div class="map-container">
    <div id="map" ref="mapContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  listings: {
    type: Array,
    required: true
  },
  center: {
    type: Object,
    default: () => ({ lat: 30.7641, lng: 76.5718 })
  },
  zoom: {
    type: Number,
    default: 13
  }
})

const emit = defineEmits(['marker-click'])

const mapContainer = ref(null)
let map = null
let markers = []

// Fix for default marker icon issue in Leaflet with bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Create custom icons for different listing types
const foodIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const productIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function initMap() {
  if (!mapContainer.value) return

  map = L.map(mapContainer.value).setView(
    [props.center.lat, props.center.lng], 
    props.zoom
  )

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map)

  // Add user location marker
  const userMarker = L.circleMarker([props.center.lat, props.center.lng], {
    radius: 10,
    fillColor: '#2196F3',
    color: '#fff',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  }).addTo(map)

  userMarker.bindPopup('<b>📍 Your Location</b>')

  // Add circle showing search radius (8km default)
  L.circle([props.center.lat, props.center.lng], {
    color: '#2196F3',
    fillColor: '#2196F3',
    fillOpacity: 0.1,
    radius: 8000 
  }).addTo(map)

  updateMarkers()
}

function updateMarkers() {
  if (!map) return

  markers.forEach(marker => marker.remove())
  markers = []

  props.listings.forEach(listing => {
    const icon = listing.type === 'food' ? foodIcon : productIcon
    
    const marker = L.marker([listing.lat, listing.lng], { icon })
      .addTo(map)
      .bindPopup(createPopupContent(listing))

    marker.on('click', () => {
      emit('marker-click', listing)
    })

    markers.push(marker)
  })

  if (markers.length > 0) {
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.1))
  }
}

function createPopupContent(listing) {
  const typeEmoji = listing.type === 'food' ? '🍔' : '📦'
  
  return `
    <div style="min-width: 200px; padding: 8px 0px 8px 0px;">
      <img src="${listing.image}" 
           style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" 
           alt="${listing.name}" />
      <h3 style="margin: 0 0 8px 0; font-size: 16px;">
        ${typeEmoji} ${listing.name}
      </h3>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
        ${listing.description.substring(0, 80)}...
      </p>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 18px; font-weight: bold; color: #4CAF50;">
          ₹${listing.price}
        </span>
        <span style="font-size: 14px; color: #666;">
          📍 ${listing.distance} km
        </span>
      </div>
      <a href="/listing/${listing.id}" 
         style="display: block; margin-top: 12px; padding: 8px; background: #2196F3; color: white; text-align: center; text-decoration: none; border-radius: 6px; font-size: 14px;">
        View Details
      </a>
    </div>
  `
}

// Watch for listing changes
watch(() => props.listings, () => {
  if (map) {
    updateMarkers()
  }
}, { deep: true })

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border-radius: 12px;
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

/* Override Leaflet popup styles */
:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
  padding: 0;
}

:deep(.leaflet-popup-content) {
  margin: 12px;
  min-width: 200px;
}
</style>
