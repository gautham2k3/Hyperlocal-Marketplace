<template>
  <div class="create-listing">
    <div class="container">
      <header class="page-header">
        <h1 class="title">Create listing</h1>
        <p class="subtitle">Share what you're selling with your community</p>
      </header>
      
      <div class="form-card">
        <div class="type-selector">
          <button 
            @click="listingType = 'food'" 
            :class="['type-btn', { active: listingType === 'food' }]"
          >
            Food
          </button>
          <button 
            @click="listingType = 'product'" 
            :class="['type-btn', { active: listingType === 'product' }]"
          >
            Product
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="form">
          <!-- Basic Information -->
          <div class="section">
            <h2 class="section-title">Basic information</h2>
            
            <div class="field">
              <label class="label">Name*</label>
              <input 
                v-model="form.name" 
                type="text" 
                class="input" 
                placeholder="e.g., Homemade Biryani"
                required 
              />
            </div>
            
            <div class="field">
              <label class="label">Description*</label>
              <textarea 
                v-model="form.description" 
                class="textarea" 
                rows="4"
                placeholder="Describe your item in detail..."
                required
              ></textarea>
              <span class="hint">{{ form.description.length }}/500 characters</span>
            </div>
            
            <div class="field-row">
              <div class="field">
                <label class="label">Price (₹)*</label>
                <input 
                  v-model="form.price" 
                  type="number" 
                  class="input" 
                  placeholder="0"
                  min="0"
                  required 
                />
              </div>
              
              <div class="field">
                <label class="label">Image URL*</label>
                <input 
                  v-model="form.image" 
                  type="url" 
                  class="input" 
                  placeholder="https://..."
                  required 
                />
              </div>
            </div>
          </div>
          
          <!-- Food-specific Fields -->
          <div v-if="listingType === 'food'" class="section">
            <h2 class="section-title">Availability</h2>
            
            <div class="field-row">
              <div class="field">
                <label class="label">Available from*</label>
                <input 
                  v-model="form.availableFrom" 
                  type="time" 
                  class="input" 
                  required 
                />
              </div>
              
              <div class="field">
                <label class="label">Available to*</label>
                <input 
                  v-model="form.availableTo" 
                  type="time" 
                  class="input" 
                  required 
                />
              </div>
            </div>
            
            <div class="field">
              <label class="label">Quantity available*</label>
              <input 
                v-model="form.quantity" 
                type="number" 
                class="input" 
                min="1"
                placeholder="1"
                required 
              />
            </div>
            
            <div class="field">
              <label class="label">Ingredients</label>
              <input 
                v-model="form.ingredients" 
                type="text" 
                class="input" 
                placeholder="Rice, Chicken, Spices..."
              />
              <span class="hint">Comma-separated list (optional)</span>
            </div>
          </div>
          
          <!-- Product-specific Fields -->
          <div v-else class="section">
            <h2 class="section-title">Product details</h2>
            
            <div class="field-row">
              <div class="field">
                <label class="label">Category*</label>
                <select v-model="form.category" class="select" required>
                  <option value="" disabled>Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="books">Books</option>
                  <option value="furniture">Furniture</option>
                  <option value="clothing">Clothing</option>
                </select>
              </div>
              
              <div class="field">
                <label class="label">Condition*</label>
                <select v-model="form.condition" class="select" required>
                  <option value="new">New</option>
                  <option value="used">Used - Like new</option>
                  <option value="fair">Used - Good</option>
                  <option value="worn">Used - Fair</option>
                </select>
              </div>
            </div>
            
            <div class="field">
              <label class="label">Pickup location*</label>
              <input 
                v-model="form.pickupLocation" 
                type="text" 
                class="input" 
                placeholder="Building name or landmark"
                required 
              />
            </div>
          </div>
          
          <!-- Actions -->
          <div class="actions">
            <button type="button" class="btn-secondary" @click="saveDraft">
              Save draft
            </button>
            <button type="submit" class="btn-primary">
              Publish listing
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useListingsStore } from '@/stores/listings'

const router = useRouter()
const listingsStore = useListingsStore()

const listingType = ref('food')
const form = ref({
  name: '',
  description: '',
  price: '',
  image: '',
  availableFrom: '09:00',
  availableTo: '21:00',
  quantity: 1,
  ingredients: '',
  category: '',
  condition: 'new',
  pickupLocation: ''
})

function handleSubmit() {
  const listing = {
    ...form.value,
    type: listingType.value,
    status: 'published'
  }
  
  if (listingType.value === 'food') {
    listing.ingredients = form.value.ingredients.split(',').map(i => i.trim())
  }
  
  listingsStore.addListing(listing)
  alert('Listing published successfully!')
  router.push('/seller-dashboard')
}

function saveDraft() {
  const listing = {
    ...form.value,
    type: listingType.value,
    status: 'draft'
  }
  
  listingsStore.addListing(listing)
  alert('Listing saved as draft!')
  router.push('/seller-dashboard')
}
</script>

<style scoped>
.create-listing {
  min-height: 100vh;
  background: #fff;
  padding: 80px 0 60px;
}

.container {
  max-width: 720px;
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

.form-card {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  padding: 32px;
}

/* Type Selector */
.type-selector {
  display: inline-flex;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 40px;
  width: 100%;
  max-width: 320px;
}

.type-btn {
  flex: 1;
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn.active {
  background: #000;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

/* Form */
.form {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin: 0 0 4px 0;
  letter-spacing: -0.3px;
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.label {
  font-size: 14px;
  font-weight: 500;
  color: #000;
}

.input,
.textarea,
.select {
  padding: 12px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  font-size: 15px;
  color: #000;
  background: #fff;
  transition: all 0.2s ease;
  font-family: inherit;
}

.input:focus,
.textarea:focus,
.select:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 1px #000;
}

.input::placeholder,
.textarea::placeholder {
  color: #999;
}

.textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.hint {
  font-size: 13px;
  color: #999;
}

/* Actions */
.actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 14px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: #000;
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: #fff;
  color: #000;
  border: 1px solid #e5e5e5;
}

.btn-secondary:hover {
  background: #f5f5f5;
  border-color: #000;
}

/* Responsive */
@media (max-width: 768px) {
  .create-listing {
    padding: 60px 0 40px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .form-card {
    padding: 24px;
    border-radius: 12px;
  }
  
  .type-selector {
    max-width: 100%;
  }
  
  .field-row {
    grid-template-columns: 1fr;
  }
  
  .actions {
    flex-direction: column-reverse;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
  
  .form-card {
    padding: 20px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 15px;
  }
}
</style>
