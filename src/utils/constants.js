export const CATEGORIES = {
  FOOD: [
    { value: 'indian', label: 'Indian' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'continental', label: 'Continental' },
    { value: 'dessert', label: 'Desserts' },
    { value: 'healthy', label: 'Healthy' },
    { value: 'snacks', label: 'Snacks' }
  ],
  PRODUCT: [
    { value: 'electronics', label: 'Electronics' },
    { value: 'books', label: 'Books' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ]
}

export const ORDER_STATUS = {
  ORDERED: 'ordered',
  ACCEPTED: 'accepted',
  READY: 'ready',
  PICKED: 'picked',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
}

export const SELLER_BADGES = {
  NEW: 'New',
  VERIFIED: 'Verified',
  TOP_RATED: 'Top Rated',
  HYGIENE_CHECKED: 'Hygiene Checked'
}

export const PLATFORM_FEES = {
  FOOD: 3,
  NEW_PRODUCT: 5,
  USED_PRODUCT: 2,
  SERVICE_FEE: 2
}

export const MAX_DELIVERY_RADIUS = 8
export const DEFAULT_LOCATION = { lat: 30.7641, lng: 76.5718 }