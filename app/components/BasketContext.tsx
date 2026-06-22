'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

interface BasketItem {
  id: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    price: number
    icon: string
    code: string
  }
}

interface BasketContextType {
  items: BasketItem[]
  itemCount: number
  addItem: (productId: number) => Promise<void>
  removeItem: (productId: number) => Promise<void>
  updateQty: (productId: number, quantity: number) => Promise<void>
  loading: boolean
  refreshBasket: () => Promise<void>
}

const BasketContext = createContext<BasketContextType | null>(null)

export function BasketProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const [items, setItems] = useState<BasketItem[]>([])
  const [loading, setLoading] = useState(false)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  async function refreshBasket() {
    if (!session) { setItems([]); return }
    setLoading(true)
    try {
      const res = await fetch('/api/basket')
      const data = await res.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Failed to fetch basket')
    }
    setLoading(false)
  }

  useEffect(() => {
    refreshBasket()
  }, [session])

  async function addItem(productId: number) {
    if (!session) {
      window.location.href = '/login'
      return
    }
    await fetch('/api/basket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 })
    })
    await refreshBasket()
  }

  async function removeItem(productId: number) {
    await fetch('/api/basket', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })
    await refreshBasket()
  }

  async function updateQty(productId: number, quantity: number) {
    if (quantity < 1) {
      await removeItem(productId)
      return
    }
    await fetch('/api/basket', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    })
    await refreshBasket()
  }

  return (
    <BasketContext.Provider value={{ items, itemCount, addItem, removeItem, updateQty, loading, refreshBasket }}>
      {children}
    </BasketContext.Provider>
  )
}

export function useBasket() {
  const context = useContext(BasketContext)
  if (!context) throw new Error('useBasket must be used within BasketProvider')
  return context
}