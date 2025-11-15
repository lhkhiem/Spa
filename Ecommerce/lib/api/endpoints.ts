// API endpoint constants
export const API_ENDPOINTS = {
  // Auth (Customer Account)
  AUTH: {
    LOGIN: '/public/auth/login',
    REGISTER: '/public/auth/register',
    LOGOUT: '/public/auth/logout',
    REFRESH: '/public/auth/refresh',
    VERIFY_EMAIL: '/public/auth/verify-email',
    FORGOT_PASSWORD: '/public/auth/forgot-password',
    RESET_PASSWORD: '/public/auth/reset-password',
    ME: '/public/auth/me',
  },

  // Products
  PRODUCTS: {
    LIST: '/public/products',
    DETAIL: (slug: string) => `/public/products/${slug}`,
    SEARCH: '/public/products/search',
    FEATURED: '/public/products/featured',
    BEST_SELLERS: '/public/products/best-sellers',
    NEW_ARRIVALS: '/public/products/new-arrivals',
    RELATED: (productSlug: string) => `/public/products/${productSlug}/related`,
    REVIEWS: (productId: string) => `/products/${productId}/reviews`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (slug: string) => `/categories/${slug}`,
    TREE: '/categories/tree',
    PRODUCTS: (slug: string) => `/categories/${slug}/products`,
  },

  // Brands
  BRANDS: {
    LIST: '/brands',
    DETAIL: (slug: string) => `/brands/${slug}`,
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
    CREATE: '/public/orders',
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

  // Newsletter
  NEWSLETTER: {
    SUBSCRIBE: '/newsletter/subscribe',
  },

  // Posts
  POSTS: {
    LIST: '/public/posts',
    DETAIL: (slug: string) => `/public/posts/${slug}`,
    RELATED: (postId: string) => `/public/posts/${postId}/related`,
  },
} as const;
