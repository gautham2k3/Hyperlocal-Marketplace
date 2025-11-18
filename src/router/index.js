import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomePage from '@/views/user/HomePage.vue'
import LoginPage from '@/views/auth/LoginPage.vue'
import ListingDetails from '@/views/user/ListingDetails.vue'
import CartPage from '@/views/user/CartPage.vue'
import CheckoutPage from '@/views/user/CheckoutPage.vue'
import OrderTracking from '@/views/user/OrderTracking.vue'
import ProfilePage from '@/views/user/ProfilePage.vue'
import CreateListing from '@/views/user/CreateListing.vue'
import SellerDashboard from '@/views/user/SellerDashboard.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import ListingsModeration from '@/views/admin/ListingsModeration.vue'
import UserManagement from '@/views/admin/UserManagement.vue'
import SettingsPanel from '@/views/admin/SettingsPanel.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/listing/:id',
    name: 'listing-details',
    component: ListingDetails
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/order/:id',
    name: 'order-tracking',
    component: OrderTracking,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-listing',
    name: 'create-listing',
    component: CreateListing,
    meta: { requiresAuth: true }
  },
  {
    path: '/seller-dashboard',
    name: 'seller-dashboard',
    component: SellerDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/listings',
    name: 'admin-listings',
    component: ListingsModeration,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: UserManagement,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: SettingsPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
