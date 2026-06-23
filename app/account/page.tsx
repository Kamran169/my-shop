'use client'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Order {
  id: number
  status: string
  total: number
  createdAt: string
  delivery: string
  items: {
    id: number
    quantity: number
    price: number
    product: {
      name: string
      icon: string
    }
  }[]
}

interface UserData {
  name: string
  email: string
  phone: string
  type: string
  createdAt: string
}

export default function AccountPage() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'orders' | 'details'>('orders')

  useEffect(() => {
    if (session) {
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          setOrders(data.orders || [])
          setUser(data.user || null)
          setLoading(false)
        })
    }
  }, [session])

  if (!session) return (
    <div style={{maxWidth:'600px', margin:'60px auto', padding:'0 20px', textAlign:'center'}}>
      <div style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'40px'}}>
        <div style={{fontSize:'60px', marginBottom:'16px'}}>👤</div>
        <h2 style={{marginBottom:'12px'}}>Please sign in to view your account</h2>
        <Link href="/login" style={{background:'#cc0000', color:'white', padding:'12px 28px', borderRadius:'4px', fontWeight:'bold', textDecoration:'none', display:'inline-block'}}>
          Sign In
        </Link>
      </div>
    </div>
  )

  const statusColor = (status: string) => {
    switch(status) {
      case 'delivered': return '#007700'
      case 'dispatched': return '#ff6600'
      case 'cancelled': return '#cc0000'
      default: return '#0055cc'
    }
  }

  const statusBg = (status: string) => {
    switch(status) {
      case 'delivered': return '#e8f5e9'
      case 'dispatched': return '#fff3e0'
      case 'cancelled': return '#ffebee'
      default: return '#e3f2fd'
    }
  }

  return (
    <div style={{maxWidth:'1000px', margin:'24px auto', padding:'0 20px'}}>

      <div style={{background:'linear-gradient(135deg, #cc0000, #880000)', color:'white', borderRadius:'8px', padding:'24px 28px', marginBottom:'24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px'}}>
        <div>
          <h1 style={{fontSize:'24px', fontWeight:'900', marginBottom:'4px'}}>
            Welcome back, {session.user?.name}! 👋
          </h1>
          <p style={{opacity:0.8, fontSize:'14px'}}>{session.user?.email}</p>
        </div>
        <button onClick={() => signOut()}
          style={{background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)', color:'white', padding:'8px 18px', borderRadius:'4px', cursor:'pointer', fontSize:'14px', fontWeight:'bold'}}>
          Sign Out
        </button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'16px', marginBottom:'24px'}}>
        <div style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'20px', textAlign:'center'}}>
          <div style={{fontSize:'32px', fontWeight:'900', color:'#cc0000'}}>{orders.length}</div>
          <div style={{fontSize:'13px', color:'#888', marginTop:'4px'}}>Total Orders</div>
        </div>
        <div style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'20px', textAlign:'center'}}>
          <div style={{fontSize:'32px', fontWeight:'900', color:'#cc0000'}}>
            £{orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
          </div>
          <div style={{fontSize:'13px', color:'#888', marginTop:'4px'}}>Total Spent</div>
        </div>
        <div style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'20px', textAlign:'center'}}>
          <div style={{fontSize:'32px', fontWeight:'900', color:'#cc0000'}}>
            {orders.filter(o => o.status === 'delivered').length}
          </div>
          <div style={{fontSize:'13px', color:'#888', marginTop:'4px'}}>Delivered</div>
        </div>
        <div style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'20px', textAlign:'center'}}>
          <div style={{fontSize:'32px', fontWeight:'900', color:'#007700'}}>⭐</div>
          <div style={{fontSize:'13px', color:'#888', marginTop:'4px'}}>Loyalty Member</div>
        </div>
      </div>

      <div style={{display:'flex', borderBottom:'2px solid #ddd', marginBottom:'24px'}}>
        <button onClick={() => setTab('orders')}
          style={{padding:'12px 24px', fontWeight:'bold', fontSize:'14px', border:'none', cursor:'pointer', background:'none', borderBottom: tab === 'orders' ? '2px solid #cc0000' : 'none', color: tab === 'orders' ? '#cc0000' : '#888', marginBottom:'-2px'}}>
          📦 My Orders
        </button>
        <button onClick={() => setTab('details')}
          style={{padding:'12px 24px', fontWeight:'bold', fontSize:'14px', border:'none', cursor:'pointer', background:'none', borderBottom: tab === 'details' ? '2px solid #cc0000' : 'none', color: tab === 'details' ? '#cc0000' : '#888', marginBottom:'-2px'}}>
          👤 My Details
        </button>
      </div>

      {tab === 'orders' && (
        <div>
          {loading && (
            <div style={{textAlign:'center', padding:'40px', color:'#888'}}>
              ⏳ Loading your orders...
            </div>
          )}
          {!loading && orders.length === 0 && (
            <div style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'60px', textAlign:'center'}}>
              <div style={{fontSize:'60px', marginBottom:'16px'}}>📦</div>
              <h3 style={{fontSize:'20px', marginBottom:'8px'}}>No orders yet</h3>
              <p style={{color:'#888', marginBottom:'20px'}}>Start shopping to see your orders here!</p>
              <Link href="/products" style={{background:'#cc0000', color:'white', padding:'12px 28px', borderRadius:'4px', fontWeight:'bold', textDecoration:'none', display:'inline-block'}}>
                Shop Now
              </Link>
            </div>
          )}
          {orders.map(order => (
            <div key={order.id} style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', marginBottom:'16px', overflow:'hidden'}}>
              <div style={{background:'#f9f9f9', padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px', borderBottom:'1px solid #eee'}}>
                <div>
                  <div style={{fontWeight:'bold', fontSize:'15px'}}>Order #TF-{String(order.id).padStart(6, '0')}</div>
                  <div style={{fontSize:'12px', color:'#888', marginTop:'2px'}}>
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}
                  </div>
                </div>
                <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                  <span style={{background: statusBg(order.status), color: statusColor(order.status), padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'bold', textTransform:'capitalize'}}>
                    {order.status}
                  </span>
                  <div style={{fontSize:'18px', fontWeight:'900', color:'#cc0000'}}>
                    £{order.total.toFixed(2)}
                  </div>
                </div>
              </div>
              <div style={{padding:'14px 18px'}}>
                {order.items.map(item => (
                  <div key={item.id} style={{display:'flex', gap:'12px', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #f5f5f5'}}>
                    <div style={{fontSize:'24px'}}>{item.product.icon}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'13px', fontWeight:'bold'}}>{item.product.name}</div>
                      <div style={{fontSize:'12px', color:'#888'}}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{fontSize:'14px', fontWeight:'bold'}}>£{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'details' && (
        <div style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'24px'}}>
          <h3 style={{fontSize:'16px', fontWeight:'bold', marginBottom:'20px', borderLeft:'4px solid #cc0000', paddingLeft:'12px'}}>
            Personal Details
          </h3>
          {[
            ['Full Name', session.user?.name],
            ['Email Address', session.user?.email],
            ['Phone Number', user?.phone || 'Not provided'],
            ['Account Type', user?.type || 'Personal'],
            ['Member Since', user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { month:'long', year:'numeric' }) : ''],
          ].map(([label, value], i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f5f5f5', fontSize:'14px'}}>
              <span style={{color:'#666'}}>{label}</span>
              <span style={{fontWeight:'bold'}}>{value}</span>
            </div>
          ))}
          <div style={{marginTop:'20px'}}>
            <Link href="/products" style={{background:'#cc0000', color:'white', padding:'10px 20px', borderRadius:'4px', fontWeight:'bold', textDecoration:'none', display:'inline-block', fontSize:'14px'}}>
              🛒 Continue Shopping
            </Link>
          </div>
        </div>
      )}

    </div>
  )
}
