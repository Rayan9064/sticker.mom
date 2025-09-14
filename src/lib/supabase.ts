import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  name: string
  price: number
  images: string[]
  description: string
  category: string
  inStock: boolean
  created_at?: string
  updated_at?: string
}

export interface ItemFormData {
  name: string
  price: number
  images: string[]
  description: string
  category: string
  inStock: boolean
}