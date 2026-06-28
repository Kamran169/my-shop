export interface CartItem {
  id: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    image: string
    code: string
    stock: number
  }
}

export interface CartSummary {
  items: CartItem[]
  itemCount: number
  subtotalExVAT: number
  vat: number
  total: number
  freeDelivery: boolean
}
