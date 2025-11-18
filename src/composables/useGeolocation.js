import { ref, onMounted } from 'vue'
import { DEFAULT_LOCATION } from '@/utils/constants'

export function useGeolocation() {
  const location = ref(null)
  const error = ref(null)
  const loading = ref(false)

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      error.value = 'Geolocation is not supported'
      location.value = DEFAULT_LOCATION
      return
    }

    loading.value = true
    navigator.geolocation.getCurrentPosition(
      (position) => {
        location.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        loading.value = false
      },
      (err) => {
        error.value = err.message
        location.value = DEFAULT_LOCATION
        loading.value = false
      }
    )
  }

  onMounted(() => {
    getCurrentLocation()
  })

  return {
    location,
    error,
    loading,
    getCurrentLocation
  }
}
