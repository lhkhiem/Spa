// API endpoint constants
export const API_ENDPOINTS = {
  // Auth (Customer Account) - Ecommerce Backend
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
  },

  // Products - Ecommerce Backend (bỏ /public prefix)
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (slug: string) => `/products/${slug}`,
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
    BEST_SELLERS: '/products/best-sellers',
    NEW_ARRIVALS: '/products/new-arrivals',
    RELATED: (productSlug: string) => `/products/${productSlug}/related`,
    REVIEWS: (productId: string) => `/products/${productId}/reviews`,
  },

  // Categories - Ecommerce Backend
  CATEGORIES: {
    LIST: '/product-categories',
    DETAIL: (slug: string) => `/product-categories/slug/${slug}`,
    TREE: '/product-categories/tree',
    PRODUCTS: (slug: string) => `/product-categories/${slug}/products`,
  },

  // Brands - Ecommerce Backend
  BRANDS: {
    LIST: '/brands',
    DETAIL: (slug: string) => `/brands/slug/${slug}`,
    PRODUCTS: (slug: string) => `/brands/${slug}/products`,
  },

  // Cart (Customer Account)
  CART: {
    GET: '/public/cart',
    ADD: '/public/cart/add',
    UPDATE: '/public/cart/update',
    REMOVE: '/public/cart/remove',
    CLEAR: '/public/cart/clear',
    APPLY_PROMO: '/public/cart/promo',
  },

  // Orders (Customer Account)
  ORDERS: {
    LIST: '/public/orders',
    DETAIL: (orderId: string) => `/public/orders/${orderId}`,
    CREATE: '/orders', // Public route - create order (no auth required)
    CANCEL: (orderId: string) => `/public/orders/${orderId}/cancel`,
  },

  // User (Customer Account)
  USER: {
    PROFILE: '/public/user/profile',
    UPDATE_PROFILE: '/public/user/profile',
    ADDRESSES: '/public/user/addresses',
    ADD_ADDRESS: '/public/user/addresses',
    UPDATE_ADDRESS: (addressId: string) => `/public/user/addresses/${addressId}`,
    DELETE_ADDRESS: (addressId: string) => `/public/user/addresses/${addressId}`,
    WISHLIST: '/public/user/wishlist',
    ADD_TO_WISHLIST: '/public/user/wishlist/add',
    REMOVE_FROM_WISHLIST: '/public/user/wishlist/remove',
  },

  // Search
  SEARCH: {
    PRODUCTS: '/search/products',
    SUGGESTIONS: '/search/suggestions',
  },

  // Newsletter - Ecommerce Backend
  NEWSLETTER: {
    SUBSCRIBE: '/newsletter/subscribe',
  },

  // Contact - Ecommerce Backend
  CONTACTS: {
    SUBMIT: '/contacts',
  },

  // Analytics - Ecommerce Backend
  ANALYTICS: {
    TRACK: '/analytics/track',
  },

  // Posts
  POSTS: {
    LIST: '/public/posts',
    DETAIL: (slug: string) => `/public/posts/${slug}`,
    RELATED: (postId: string) => `/public/posts/${postId}/related`,
  },

  // About Sections
  ABOUT: {
    SECTIONS: '/about-sections',
    SECTION_BY_KEY: (key: string) => `/about-sections/key/${key}`,
  },

  // Tracking Scripts
  TRACKING: {
    ACTIVE_SCRIPTS: '/tracking-scripts/active',
  },
} as const;
