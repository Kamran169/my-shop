'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useBasket } from './BasketContext'

const navLinks = [
  '🔧 Tools','🔌 Electrical','🚿 Plumbing','🪟 Bathrooms',
  '🌿 Outdoor','🔩 Screws & Fixings','🔐 Security',
  '🏗️ Building','🦺 Safety & Workwear','🎨 Painting',
  '🪜 Ladders','🚗 Auto'
]

export default function Header() {
  const { data: session } = useSession()
  const { itemCount } = useBasket()

  return (
    <>
      <div style={{background:'#cc0000', color:'white', fontSize:'13px', padding:'6px 20px', display:'flex', justifyContent:'flex-end', gap:'20px'}}>
        <a href="#" style={{color:'white', textDecoration:'none'}}>Need Help?</a>
        {session ? (
          <span style={{color:'white'}}>👤 {session.user?.name}</span>
        ) : (
          <Link href="/login" style={{color:'white', textDecoration:'none'}}>Sign In / Register</Link>
        )}
        <a href="#" style={{color:'white', textDecoration:'none'}}>Track My Order</a>
      </div>

      <header style={{background:'#cc0000', padding:'10px 20px', display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap'}}>
        <Link href="/" style={{fontSize:'26px', fontWeight:'900', color:'white', textDecoration:'none'}}>
          Trade<span style={{color:'#ffe000'}}>fix</span>
        </Link>
        <div style={{flex:1, display:'flex', minWidth:'200px'}}>
          <input type="text" placeholder="Search over 30,000 products..."
            style={{flex:1, padding:'10px 14px', border:'none', fontSize:'15px', borderRadius:'4px 0 0 4px', outline:'none'}} />
          <button style={{background:'#ffe000', border:'none', padding:'10px 18px', fontWeight:'bold', cursor:'pointer', borderRadius:'0 4px 4px 0'}}>
            🔍 Search
          </button>
        </div>
        <div style={{display:'flex', gap:'18px', alignItems:'center'}}>
          <a href="#" style={{color:'white', textDecoration:'none', fontSize:'13px', textAlign:'center'}}>
            📍<br/>Find a Store
          </a>
          {session ? (
  <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
    <Link href="/account" style={{color:'white', textDecoration:'none', fontSize:'13px', textAlign:'center'}}>
      👤<br/>{session.user?.name}
    </Link>
    <button onClick={() => signOut()}
      style={{background:'none', border:'1px solid white', color:'white', padding:'6px 14px', borderRadius:'4px', cursor:'pointer', fontSize:'13px', fontWeight:'bold'}}>
      Sign Out
    </button>
  </div>
) : (
  <Link href="/login" style={{color:'white', textDecoration:'none', fontSize:'13px', textAlign:'center'}}>
    👤<br/>Sign In
  </Link>
)}
          <Link href="/basket" style={{background:'#ffe000', color:'#222', padding:'8px 16px', borderRadius:'4px', fontWeight:'bold', textDecoration:'none', position:'relative'}}>
            🛒 Basket ({itemCount})
          </Link>
        </div>
      </header>

      <nav style={{background:'#222', display:'flex', overflowX:'auto'}}>
        {navLinks.map((link, i) => (
          <a key={i} href="#" style={{color:'white', textDecoration:'none', padding:'12px 16px', fontSize:'13px', whiteSpace:'nowrap', display:'block'}}>
            {link}
          </a>
        ))}
      </nav>
    </>
  )
}