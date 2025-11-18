<template>
  <div class="login-page">
    <div class="login-container glass-card">
      <div class="brand">
        <img src="@/assets/hyperlocal_marketplace_logo.png" alt="Logo" class="logo-img" />
        <h1 class="brand-name">Hyperlocal Marketplace</h1>
      </div>
        
      <h2 class="title">{{ showOTP ? 'Verify OTP' : 'Welcome back' }}</h2>
      
      <!-- Error message -->
      <div v-if="authStore.error" class="message error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ authStore.error }}
      </div>
      
      <!-- Info message -->
      <div v-if="showOTP" class="message info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4"/>
          <path d="M12 8h.01"/>
        </svg>
        Demo OTP: <strong>123456</strong>
      </div>
      
      <form @submit.prevent="handleSubmit" class="form">
        <!-- Phone Input -->
        <div class="field">
          <label class="label">Phone number</label>
          <input 
            v-model="phone" 
            type="tel" 
            class="input" 
            placeholder="+91 98765 43210"
            :disabled="showOTP || authStore.loading"
            required 
          />
        </div>
        
        <!-- OTP Input -->
        <transition name="slide-down">
          <div v-if="showOTP" class="field">
            <label class="label">Enter OTP</label>
            <input
              v-model="otp"
              type="text"
              maxlength="6"
              class="input otp-input"
              placeholder="000000"
              :disabled="authStore.loading"
              required
            />
            <p class="hint">Enter demo code: 123456</p>
          </div>
        </transition>

        <!-- Submit Button -->
        <button 
          type="submit" 
          class="btn-submit"
          :disabled="authStore.loading"
        >
          <span v-if="authStore.loading" class="spinner"></span>
          <span v-else>{{ showOTP ? 'Verify & continue' : 'Send OTP' }}</span>
        </button>
        
        <!-- Back button when OTP is shown -->
        <button 
          v-if="showOTP"
          type="button"
          class="btn-back"
          @click="showOTP = false; otp = ''"
          :disabled="authStore.loading"
        >
          Change number
        </button>
      </form>

      <p class="terms">
        By continuing, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const phone = ref('+91-9876543210')
const otp = ref('')
const showOTP = ref(false)

async function handleSubmit() {
  console.log('📝 Form submitted')
  console.log('Show OTP:', showOTP.value)
  
  if (!showOTP.value) {
    // Step 1: Send OTP
    console.log('Sending OTP to:', phone.value)
    const success = await authStore.sendOTP(phone.value)
    
    if (success) {
      showOTP.value = true
      console.log('✅ OTP sent, showing input field')
    } else {
      console.error('❌ Failed to send OTP')
    }
  } else {
    // Step 2: Verify OTP
    console.log('Verifying OTP:', otp.value)
    
    if (!otp.value || otp.value.length !== 6) {
      authStore.error = 'Please enter 6-digit OTP'
      return
    }
    
    const success = await authStore.verifyOTP(otp.value)
    
    if (success) {
      console.log('✅ Login successful, redirecting...')
      router.push('/')
    } else {
      console.error('❌ OTP verification failed')
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background-attachment: fixed;
  padding: 24px;
}

.login-container {
  max-width: 420px;
  width: 100%;
  padding: 40px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

/* Brand styles in <style scoped> */
.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.logo-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 12px;
}

.brand-name {
  font-size: 28px;
  font-weight: 600;
  color: #000;
  margin: 0;
  letter-spacing: -0.5px;
}

/* Responsive adjustment */
@media (max-width: 480px) {
  .brand-name {
    font-size: 20px;
  }
  
  .logo-img {
    width: 40px;
    height: 40px;
  }
}


.title {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin: 0 0 32px 0;
  letter-spacing: -0.3px;
}

/* Messages */
.message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  line-height: 1.5;
}

.message svg {
  flex-shrink: 0;
}

.message.error {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.message.info {
  background: rgba(0, 0, 0, 0.03);
  color: #000;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

/* Form */
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.input {
  padding: 14px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 15px;
  color: #000;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #000;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input::placeholder {
  color: #999;
}

.otp-input {
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: 12px;
  padding: 20px 16px;
}

.hint {
  font-size: 13px;
  color: #666;
  text-align: center;
  margin: 0;
}

/* Buttons */
.btn-submit {
  width: 100%;
  padding: 14px 24px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-back {
  width: 100%;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.03);
  color: #666;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
  color: #000;
}

.btn-back:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Terms */
.terms {
  text-align: center;
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.terms a {
  color: #000;
  text-decoration: none;
  font-weight: 500;
}

.terms a:hover {
  text-decoration: underline;
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 32px 24px;
  }
  
  .brand-name {
    font-size: 24px;
  }
  
  .title {
    font-size: 18px;
  }
  
  .otp-input {
    font-size: 28px;
    letter-spacing: 8px;
  }
}
</style>
