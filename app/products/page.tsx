import { prisma } from '../lib/prisma'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div style={{maxWidth:'1200px', margin:'0 auto', padding:'24px 20px'}}>

      <div style={{fontSize:'13px', marginBottom:'20px', color:'#888'}}>
        <a href="/" style={{color:'#cc0000', textDecoration:'none'}}>Home</a> › Products
      </div>

      <div style={{fontSize:'20px', fontWeight:'900', marginBottom:'20px', borderLeft:'4px solid #cc0000', paddingLeft:'12px'}}>
        All Products ({products.length})
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'16px'}}>
        {products.map((p) => (
          <div key={p.id} style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'16px', display:'flex', flexDirection:'column', gap:'8px', position:'relative'}}>

            {p.badge && (
              <span style={{position:'absolute', top:'10px', left:'10px', background: p.badge === 'NEW' ? '#007700' : '#cc0000', color:'white', fontSize:'10px', fontWeight:'bold', padding:'2px 8px', borderRadius:'3px'}}>
                {p.badge}
              </span>
            )}

            <div style={{width:'100%', height:'140px', background:'#f0f0f0', borderRadius:'4px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'50px'}}>
              {p.icon}
            </div>

            <div style={{fontSize:'13px', fontWeight:'bold', lineHeight:'1.4'}}>{p.name}</div>
            <div style={{fontSize:'11px', color:'#888'}}>Code: {p.code}</div>

            <div style={{fontSize:'12px', color: p.stock <= 5 ? '#cc0000' : p.stock <= 10 ? '#ff6600' : '#007700', fontWeight:'bold'}}>
              {p.stock === 0 ? '❌ Out of Stock' : p.stock <= 5 ? `⚠️ Only ${p.stock} left!` : '✅ In Stock'}
            </div>

            {p.wasPrice && (
              <div style={{fontSize:'12px', color:'#888', textDecoration:'line-through'}}>£{p.wasPrice.toFixed(2)}</div>
            )}

            <div style={{fontSize:'22px', fontWeight:'900', color:'#cc0000'}}>£{p.price.toFixed(2)}</div>
            <div style={{fontSize:'11px', color:'#888'}}>Inc. VAT</div>

            <button
              disabled={p.stock === 0}
              style={{background: p.stock === 0 ? '#ddd' : '#ffe000', border:'none', padding:'10px', fontWeight:'bold', fontSize:'14px', borderRadius:'4px', cursor: p.stock === 0 ? 'not-allowed' : 'pointer', marginTop:'auto'}}>
              {p.stock === 0 ? 'Out of Stock' : '🛒 Add to Basket'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}