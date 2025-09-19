// Database Types
export interface User {
  id: string
  email: string
  password_hash: string
  role: 'admin' | 'editor'
  created_at: Date
  updated_at: Date
}

export interface Media {
  id: string
  filename: string
  original_filename: string
  url: string
  blob_url: string
  mime_type: string
  size: number
  width?: number
  height?: number
  alt_text?: string
  category: 'hero' | 'gallery' | 'story' | 'venue' | 'couple' | 'family'
  sort_order: number
  is_featured: boolean
  created_at: Date
  updated_at: Date
}

export interface WeddingContent {
  id: string
  section: string
  content_key: string
  content_value: any // JSON field
  created_at: Date
  updated_at: Date
}

export interface StoryMilestone {
  id: string
  title: string
  description: string
  date: string
  image_url?: string
  sort_order: number
  created_at: Date
  updated_at: Date
}

export interface FamilyMember {
  id: string
  name: string
  role: string // 'bride' | 'groom' | 'bridesmaid' | 'groomsman' | 'parent' | 'family'
  description?: string
  image_url?: string
  sort_order: number
  created_at: Date
  updated_at: Date
}

// Frontend Component Types
export interface CoupleInfo {
  bride: {
    name: string
    fullName: string
    photo?: string
  }
  groom: {
    name: string
    fullName: string
    photo?: string
  }
  weddingDate: string
  venue: string
}

export interface WeddingDetails {
  ceremony: {
    date: string
    time: string
    venue: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  reception: {
    date: string
    time: string
    venue: string
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  dressCode: string
  timeline: Array<{
    time: string
    event: string
  }>
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  category: 'engagement' | 'pre-wedding' | 'ceremony' | 'reception' | 'couple' | 'family'
  width: number
  height: number
  featured: boolean
}

export interface WishFormData {
  name: string
  message: string
  email?: string
  attendance: 'yes' | 'no' | 'maybe'
  guests?: number
}

export interface GiftRegistry {
  qrCode: string
  paymentMethods: Array<{
    name: string
    account: string
    qrCode?: string
  }>
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Admin Types
export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'editor'
}

export interface UploadedFile {
  id: string
  filename: string
  url: string
  size: number
  type: string
}

export interface ContentEditor {
  section: string
  fields: Array<{
    key: string
    label: string
    type: 'text' | 'textarea' | 'image' | 'date' | 'number' | 'select'
    value: any
    options?: string[]
  }>
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
}

export interface RSVPFormData extends WishFormData {
  phone?: string
  dietaryRestrictions?: string
  songRequest?: string
}

// Animation and UI Types
export interface AnimationConfig {
  duration: number
  delay: number
  easing: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

// SEO Types
export interface SEOConfig {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
}

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}