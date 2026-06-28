export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface Order {
  id: number
  userId?: number
  status: OrderStatus
  total: number
  firstName: string
  lastName: string
  address1: string
  address2?: string
  city: string
  postcode: string
  country: string
  createdAt: Date
  items: OrderItem[]
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product: {
    name: string
    image: string
  }
}
