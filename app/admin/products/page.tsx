'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  code: string
  category: string
  price: number
  wasPrice: number | null
  stock: number
  icon: string
  badge: string | null
  description: string | null
  active: boolean
}

const CATEGORIES = [
  'Power Tools', 'Hand Tools', 'Electrical', 'Plumbing',
  'Screws & Fixings', 'Storage & Ladders', 'Safety & Workwear',
  'Painting & Decorating', 'Building & Doors', 'Auto & Cleaning',
]

const emptyForm = {
  name: '', code: '', category: 'Power Tools', price: '',
  wasPrice: '', stock: '', icon: '📦', badge: '', description: '', active: true,
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    setLoading(true)
    const res = await fetch('/api/admin/products')
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(p: Product) {
    setEditingId(p.id)
    setForm({
      name: p.name, code: p.code, category: p.category,
      price: String(p.price), wasPrice: p.wasPrice ? String(p.wasPrice) : '',
      stock: String(p.stock), icon: p.icon, badge: p.badge || '',
      description: p.description || '', active: p.active,
    })
    setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    const url = editingId ? `/api/admin/products/${editingId}` : '/api/admin/products'
    const method = editingId ? 'PUT' : 'POST'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setModalOpen(false)
    fetchProducts()
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    fetchProducts()
  }

  function stockBadge(stock: number, active: boolean) {
    if (!active) return <span style={badge('#888', '#eee')}>Inactive</span>
    if (stock === 0) return <span style={badge('#c62828', '#ffebee')}>Out of Stock</span>
    if (stock <= 5) return <span style={badge('#c62828', '#ffebee')}>Critical</span>
    if (stock <= 15) return <span style={badge('#e65100', '#fff3e0')}>Low Stock</span>
    return <span style={badge('#2e7d32', '#e8f5e9')}>Active</span>
  }

  function badge(color: string, bg: string) {
    return { color, background: bg, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 'bold' }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: 28 }}>
      {/* TOOLBAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900 }}>📦 Products</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            placeholder="🔍 Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, width: 220 }}
          />
          <button onClick={openAdd} style={{ background: '#cc0000', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4, fontWeight: 'bold', cursor: 'pointer' }}>
            + Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: 24, color: '#888' }}>Loading products...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead style={{ background: '#f9f9f9' }}>
              <tr>
                {['', 'Product', 'Category', 'Price', 'Was', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#888', textTransform: 'uppercase', borderBottom: '1px solid #eee' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '13px 16px', fontSize: 26 }}>{p.icon}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#aaa' }}>Code: {p.code}</div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>{p.category}</td>
                  <td style={{ padding: '13px 16px', fontWeight: 'bold' }}>£{p.price.toFixed(2)}</td>
                  <td style={{ padding: '13px 16px', color: '#888', textDecoration: 'line-through' }}>
                    {p.wasPrice ? `£${p.wasPrice.toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>{p.stock}</td>
                  <td style={{ padding: '13px 16px' }}>{stockBadge(p.stock, p.active)}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => openEdit(p)} style={{ background: '#f0f0f0', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>✏️ Edit</button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: '#ffebee', color: '#cc0000', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 'bold' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#888' }}>No products found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 8, width: '90%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ background: '#222', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16, fontWeight: 'bold' }}>
              <span>{editingId ? 'Edit Product' : 'Add New Product'}</span>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 22, cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Product Name *', key: 'name', placeholder: 'e.g. Claw Hammer 16oz' },
                { label: 'Product Code *', key: 'code', placeholder: 'e.g. 12345' },
                { label: 'Price (£) *', key: 'price', placeholder: '0.00', type: 'number' },
                { label: 'Was Price (£)', key: 'wasPrice', placeholder: '0.00', type: 'number' },
                { label: 'Stock Quantity *', key: 'stock', placeholder: '0', type: 'number' },
                { label: 'Icon (emoji)', key: 'icon', placeholder: '📦' },
                { label: 'Badge (e.g. SALE, NEW)', key: 'badge', placeholder: 'optional' },
                { label: 'Description', key: 'description', placeholder: 'optional' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label style={{ fontSize: 13, fontWeight: 'bold', color: '#444', display: 'block', marginBottom: 4 }}>{label}</label>
                  <input
                    type={type || 'text'}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 13, fontWeight: 'bold', color: '#444', display: 'block', marginBottom: 4 }}>Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14 }}
                >
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                Active (visible on site)
              </label>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setModalOpen(false)} style={{ background: '#f0f0f0', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 14 }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{ background: '#cc0000', color: 'white', border: 'none', padding: '10px 24px', borderRadius: 4, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}>
                {saving ? 'Saving...' : '💾 Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}