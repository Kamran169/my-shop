'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const initialItems = [
  { id: 1, icon: '⚡', name: '18V Cordless Drill Driver', price: 69.99, quantity: 1 },
  { id: 2, icon: '🔨', name: 'Heavy Duty Claw Hammer 16oz', price: 12.99, quantity: 2 },
  { id: 3, icon: '🔩', name: 'Goldscrew Screws Trade Pack', price: 14.99, quantity: 1 },
]

export default function BasketPage() {
  const router = useRouter()
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(false)

  function updateQty(id: number, change: number) {
    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ))
  }

  function removeItem(id: number) {
    if (confirm('Remove this item?')) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vat = subtotal * 0.2 / 1.2
  const exVat = subtotal - vat

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      alert('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{maxWidth:'1100px', margin:'24px auto', padding:'0 20px', display:'flex', gap:'24px', alignItems:'flex-start', flexWrap:'wrap'}}>

      {/* BASKET ITEMS */}
      <div style={{flex:1, minWidth:'300px'}}>
        <div style={{fontSize:'20px', fontWeight:'900', marginBottom:'16px', borderLeft:'4px solid #cc0000', paddingLeft:'12px'}}>
          🛒 My Basket ({items.length} items)
        </div>

        {items.length === 0 && (
          <div style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'60px', textAlign:'center'}}>
            <div style={{fontSize:'60px', marginBottom:'16px'}}>🛒</div>
            <h3 style={{fontSize:'20px', marginBottom:'8px'}}>Your basket is empty</h3>
            <Link href="/products" style={{background:'#cc0000', color:'white', padding:'12px 28px', borderRadius:'4px', fontWeight:'bold', textDecoration:'none', display:'inline-block', marginTop:'16px'}}>
              Shop Now
            </Link>
          </div>
        )}

        {items.map(item => (
          <div key={item.id} style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'16px', display:'flex', gap:'16px', marginBottom:'12px', alignItems:'center', flexWrap:'wrap'}}>
            <div style={{width:'80px', height:'80px', background:'#f0f0f0', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'36px', flexShrink:0}}>
              {item.icon}
            </div>
            <div style={{flex:1, minWidth:'150px'}}>
              <div style={{fontSize:'14px', fontWeight:'bold', marginBottom:'4px'}}>{item.name}</div>
              <div style={{fontSize:'12px', color:'#888'}}>£{item.price.toFixed(2)} each</div>
              <button onClick={() => removeItem(item.id)}
                style={{background:'none', border:'none', color:'#cc0000', cursor:'pointer', fontSize:'13px', textDecoration:'underline', padding:0, marginTop:'6px'}}>
                🗑️ Remove
              </button>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
              <button onClick={() => updateQty(item.id, -1)}
                style={{width:'32px', height:'32px', border:'1px solid #ddd', background:'#f4f4f4', fontSize:'18px', cursor:'pointer', borderRadius:'4px'}}>
                −
              </button>
              <span style={{width:'30px', textAlign:'center', fontWeight:'bold', fontSize:'16px'}}>{item.quantity}</span>
              <button onClick={() => updateQty(item.id, 1)}
                style={{width:'32px', height:'32px', border:'1px solid #ddd', background:'#f4f4f4', fontSize:'18px', cursor:'pointer', borderRadius:'4px'}}>
                +
              </button>
            </div>
            <div style={{textAlign:'right', minWidth:'80px'}}>
              <div style={{fontSize:'20px', fontWeight:'900', color:'#cc0000'}}>
                £{(item.price * item.quantity).toFixed(2)}
              </div>
              <div style={{fontSize:'11px', color:'#888'}}>Inc. VAT</div>
            </div>
          </div>
        ))}

        <Link href="/products" style={{color:'#cc0000', textDecoration:'none', fontSize:'13px'}}>
          ← Continue Shopping
        </Link>
      </div>

      {/* ORDER SUMMARY */}
      <div style={{width:'300px', flexShrink:0, background:'white', border:'1px solid #ddd', borderRadius:'6px', overflow:'hidden', position:'sticky', top:'20px'}}>
        <div style={{background:'#222', color:'white', padding:'14px 16px', fontSize:'15px', fontWeight:'bold'}}>
          📋 Order Summary
        </div>
        <div style={{padding:'16px'}}>
          <div style={{background:'#e8f5e9', border:'1px solid #c8e6c9', borderRadius:'4px', padding:'10px 12px', fontSize:'13px', color:'#2e7d32', marginBottom:'14px', textAlign:'center'}}>
            🚚 You qualify for <strong>FREE delivery!</strong>
          </div>

          <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px', marginBottom:'10px'}}>
            <span style={{color:'#555'}}>Subtotal (ex. VAT)</span>
            <span style={{fontWeight:'bold'}}>£{exVat.toFixed(2)}</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px', marginBottom:'10px'}}>
            <span style={{color:'#555'}}>VAT (20%)</span>
            <span style={{fontWeight:'bold'}}>£{vat.toFixed(2)}</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'14px', marginBottom:'10px'}}>
            <span style={{color:'#555'}}>Delivery</span>
            <span style={{fontWeight:'bold', color:'#007700'}}>FREE</span>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:'18px', fontWeight:'900', borderTop:'2px solid #ddd', paddingTop:'12px', marginTop:'4px', marginBottom:'16px'}}>
            <span>Total</span>
            <span style={{color:'#cc0000'}}>£{subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading || items.length === 0}
            style={{background: items.length === 0 ? '#ddd' : '#cc0000', color:'white', border:'none', width:'100%', padding:'14px', fontSize:'16px', fontWeight:'bold', borderRadius:'4px', cursor: items.length === 0 ? 'not-allowed' : 'pointer', marginBottom:'10px'}}>
            {loading ? '⏳ Processing...' : '🔒 Pay with Stripe'}
          </button>

          <div style={{textAlign:'center', fontSize:'12px', color:'#888'}}>
            🔒 SSL encrypted — your details are safe
          </div>
        </div>
      </div>

    </div>
  )
}