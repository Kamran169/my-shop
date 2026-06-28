export interface Product {
  id: number
  name: string
  slug: string
  code: string
  categoryId: number
  price: number
  wasPrice?: number | null
  stock: number
  image: string
  badge?: string | null
  description?: string | null
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductWithCategory extends Product {
  category: {
    id: number
    name: string
    slug: string
  }
}

export interface ProductFormData {
  name: string
  code: string
  categoryId: number
  price: number
  wasPrice?: number
  stock: number
  image: string
  badge?: string
  description?: string
  active: boolean
}
