'use client'
import { useState } from 'react'
import { useBasket } from '../components/BasketContext'

const categories = ['All', 'Power Tools', 'Hand Tools', 'Electrical', 'Storage & Ladders']

export default function ProductsClient({ products }: { products: any[] }) {
  const { addItem } = useBasket()
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')
  const [sort, setSort] = useState('default')
  const [adding, setAdding] = useState<number | null>(null)

  const filtered = products
    .filter(p => selectedCat === 'All' || p.category === selectedCat)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'low') return a.price - b.price
      if (sort === 'high') return b.price - a.price
      return 0
    })

  function handleAddToBasket(p: any) {
    setAdding(p.id)
    addItem({
      id: String(p.id),
      name: p.name,
      price: p.price,
      icon: p.icon ?? '📦',
    })
    setTimeout(() => setAdding(null), 1000)
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
      <div style={{ fontSize: '13px', marginBottom: '20px', color: '#888' }}>
        <a href="/" style={{ color: '#cc0000', textDecoration: 'none' }}>Home</a> › Products
      </div>

      {/* TOOLBAR */}
      <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '6px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '9px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', width: '260px', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              style={{ padding: '7px 14px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', background: selectedCat === cat ? '#cc0000' : 'white', color: selectedCat === cat ? 'white' : '#222' }}
            >
              {cat}
            </button>
          ))}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
          >
            <option value="default">Sort: Best Sellers</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
        Showing <strong style={{ color: '#222' }}>{filtered.length}</strong> products
      </div>

      {/* GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
            {p.badge && (
              <span style={{ position: 'absolute', top: '10px', left: '10px', background: p.badge === 'NEW' ? '#007700' : '#cc0000', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '3px' }}>
                {p.badge}
              </span>
            )}
            <div style={{ width: '100%', height: '140px', background: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' }}>
              {p.icon ?? '📦'}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', lineHeight: '1.4' }}>{p.name}</div>
            <div style={{ fontSize: '11px', color: '#888' }}>Code: {p.code}</div>
            <div style={{ fontSize: '12px', color: p.stock <= 5 ? '#cc0000' : p.stock <= 10 ? '#ff6600' : '#007700', fontWeight: 'bold' }}>
              {p.stock === 0 ? '❌ Out of Stock' : p.stock <= 5 ? `⚠️ Only ${p.stock} left!` : '✅ In Stock'}
            </div>
            {p.wasPrice && (
              <div style={{ fontSize: '12px', color: '#888', textDecoration: 'line-through' }}>£{p.wasPrice.toFixed(2)}</div>
            )}
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#cc0000' }}>£{p.price.toFixed(2)}</div>
            <div style={{ fontSize: '11px', color: '#888' }}>Inc. VAT</div>
            <button
              onClick={() => handleAddToBasket(p)}
              disabled={p.stock === 0 || adding === p.id}
              style={{
                background: p.stock === 0 ? '#ddd' : adding === p.id ? '#007700' : '#ffe000',
                color: adding === p.id ? 'white' : '#222',
                border: 'none',
                padding: '10px',
                fontWeight: 'bold',
                fontSize: '14px',
                borderRadius: '4px',
                cursor: p.stock === 0 ? 'not-allowed' : 'pointer',
                marginTop: 'auto',
                transition: 'all 0.2s',
              }}
            >
              {adding === p.id ? '✅ Added!' : p.stock === 0 ? 'Out of Stock' : '🛒 Add to Basket'}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>No products found</div>
          <div>Try a different search term or category</div>
        </div>
      )}
    </div>
  )
}
