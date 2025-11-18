import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const sentOTP = ref(null)
  const phoneNumber = ref('')
  
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSeller = computed(() => user.value?.isSeller || false)

  // Mock: Send OTP
  async function sendOTP(phone) {
    console.log('📱 Sending OTP to:', phone)
    loading.value = true
    error.value = null
    phoneNumber.value = phone
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate mock OTP (always 123456 for testing)
    const otp = '123456'
    sentOTP.value = otp
    console.log('✅ OTP sent successfully. Use: 123456')
    
    loading.value = false
    return true
  }

  // Mock: Verify OTP
  async function verifyOTP(code) {
    console.log('🔐 Verifying OTP:', code)
    console.log('Expected OTP:', sentOTP.value)
    
    loading.value = true
    error.value = null
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (code === sentOTP.value) {
      console.log('✅ OTP verified successfully')
      user.value = {
        id: 'user-' + Date.now(),
        phone: phoneNumber.value,
        name: 'Gautham',
        email: `gautham27${Date.now()}@demo.com`,
        role: 'user',
        isSeller: false,
        createdAt: new Date().toISOString()
      }
      localStorage.setItem('user', JSON.stringify(user.value))
      loading.value = false
      return true
    } else {
      console.error('❌ Invalid OTP')
      error.value = 'Invalid OTP. Please use: 123456'
      loading.value = false
      return false
    }
  }

  function logout() {
    console.log('👋 Logging out')
    user.value = null
    sentOTP.value = null
    phoneNumber.value = ''
    localStorage.removeItem('user')
  }

  function checkAuth() {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
        console.log('✅ User loaded from localStorage:', user.value)
      } catch (e) {
        console.error('❌ Error parsing user data:', e)
        localStorage.removeItem('user')
      }
    }
  }

  function toggleSellerMode() {
    if (user.value) {
      user.value.isSeller = !user.value.isSeller
      localStorage.setItem('user', JSON.stringify(user.value))
      console.log('🔄 Seller mode toggled:', user.value.isSeller)
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isSeller,
    sendOTP,
    verifyOTP,
    logout,
    checkAuth,
    toggleSellerMode
  }
})
