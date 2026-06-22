import Link from 'next/link'

const categories = [
  { icon: '🔧', name: 'Tools' },
  { icon: '🔌', name: 'Electrical & Lighting' },
  { icon: '🚿', name: 'Heating & Plumbing' },
  { icon: '🛁', name: 'Bathrooms & Kitchens' },
  { icon: '🌿', name: 'Outdoor & Gardening' },
  { icon: '🔩', name: 'Screws & Fixings' },
  { icon: '🔐', name: 'Security' },
  { icon: '🦺', name: 'Safety & Workwear' },
  { icon: '🎨', name: 'Painting & Decorating' },
  { icon: '🪜', name: 'Storage & Ladders' },
  { icon: '🏗️', name: 'Building & Doors' },
  { icon: '🚗', name: 'Auto & Cleaning' },
]

const deals = [
  { icon: '⚡', name: '18V Cordless Drill Driver', was: '£89.99', price: '£69.99', save: 'SAVE £20', code: '34567' },
  { icon: '🔨', name: 'Heavy Duty Claw Hammer 16oz', was: '£18.99', price: '£12.99', save: 'SAVE £6', code: '12345' },
  { icon: '🪚', name: 'Circular Saw 185mm 1200W', was: '£79.99', price: '£64.99', save: 'SAVE £15', code: '56789' },
  { icon: '💡', name: 'LED GU10 Bulbs 6W Pack of 10', was: '£19.99', price: '£14.99', save: 'SAVE £5', code: '45678' },
]

export default function HomePage() {
  return (
    <div>

      {/* DELIVERY STRIP */}
      <div style={{background:'white', borderBottom:'1px solid #ddd', display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
        {[
          ['🚚 FREE Delivery','On orders over £50'],
          ['⚡ Click & Collect','Ready in as little as 1 min'],
          ['🏪 500+ Stores','Find your local store'],
          ['📦 Next Day Delivery','7 days a week'],
        ].map(([title, sub], i) => (
          <div key={i} style={{padding:'10px 24px', fontSize:'12px', fontWeight:'bold', textAlign:'center', borderRight:'1px solid #ddd'}}>
            {title}
            <span style={{color:'#cc0000', display:'block', fontSize:'11px', fontWeight:'normal'}}>{sub}</span>
          </div>
        ))}
      </div>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg, #cc0000 0%, #880000 100%)', color:'white', padding:'50px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'20px', minHeight:'220px'}}>
        <div>
          <h1 style={{fontSize:'36px', fontWeight:'900', lineHeight:'1.2', maxWidth:'500px'}}>
            This Week&apos;s Top Deals on Tools &amp; Hardware
          </h1>
          <p style={{fontSize:'16px', marginTop:'10px', color:'#ffcccc'}}>
            Thousands of products at trade prices — updated every week
          </p>
          <div style={{display:'flex', gap:'12px', marginTop:'20px', flexWrap:'wrap'}}>
            <Link href="/products" style={{background:'#ffe000', color:'#222', padding:'12px 28px', fontWeight:'bold', fontSize:'15px', borderRadius:'4px', textDecoration:'none'}}>
              Shop Deals Now
            </Link>
            <Link href="/products" style={{background:'white', color:'#cc0000', padding:'12px 28px', fontWeight:'bold', fontSize:'15px', borderRadius:'4px', textDecoration:'none'}}>
              View All Products
            </Link>
          </div>
        </div>
        <div style={{background:'#ffe000', color:'#222', borderRadius:'50%', width:'130px', height:'130px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'13px', textAlign:'center', lineHeight:'1.3'}}>
          <span style={{fontSize:'30px'}}>SAVE</span>
          UP TO<br/><span style={{fontSize:'30px'}}>40%</span>
          THIS WEEK
        </div>
      </div>

      {/* CATEGORIES */}
      <div style={{padding:'30px 20px', maxWidth:'1200px', margin:'0 auto'}}>
        <div style={{fontSize:'20px', fontWeight:'900', marginBottom:'20px', borderLeft:'4px solid #cc0000', paddingLeft:'12px'}}>
          Shop by Department
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px, 1fr))', gap:'12px'}}>
          {categories.map((cat, i) => (
            <Link key={i} href="/products" style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'18px 10px', textAlign:'center', textDecoration:'none', color:'#222', display:'block'}}>
              <div style={{fontSize:'32px', marginBottom:'8px'}}>{cat.icon}</div>
              <div style={{fontSize:'12px', fontWeight:'bold', lineHeight:'1.3'}}>{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* DEALS */}
      <div style={{padding:'0 20px 30px', maxWidth:'1200px', margin:'0 auto'}}>
        <div style={{fontSize:'20px', fontWeight:'900', marginBottom:'20px', borderLeft:'4px solid #cc0000', paddingLeft:'12px'}}>
          🔥 This Week&apos;s Top Deals
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'16px'}}>
          {deals.map((p, i) => (
            <div key={i} style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'16px', display:'flex', flexDirection:'column', gap:'8px'}}>
              <div style={{width:'100%', height:'140px', background:'#f0f0f0', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'50px'}}>
                {p.icon}
              </div>
              <div style={{fontSize:'13px', fontWeight:'bold', lineHeight:'1.4'}}>{p.name}</div>
              <div style={{fontSize:'11px', color:'#888'}}>Code: {p.code}</div>
              <div style={{fontSize:'12px', color:'#888', textDecoration:'line-through'}}>{p.was}</div>
              <span style={{background:'#cc0000', color:'white', fontSize:'11px', fontWeight:'bold', padding:'2px 8px', borderRadius:'3px', display:'inline-block', width:'fit-content'}}>
                {p.save}
              </span>
              <div style={{fontSize:'22px', fontWeight:'900', color:'#cc0000'}}>{p.price}</div>
              <div style={{fontSize:'11px', color:'#888'}}>Inc. VAT</div>
              <button style={{background:'#ffe000', border:'none', padding:'10px', fontWeight:'bold', fontSize:'14px', borderRadius:'4px', cursor:'pointer', marginTop:'auto'}}>
                🛒 Add to Basket
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}