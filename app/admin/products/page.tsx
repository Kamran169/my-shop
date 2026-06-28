'use client'
import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  code: string
  category: { name: string }
  price: number
  wasPrice: number | null
  stock: number
  image: string
  badge: string | null
  active: boolean
}

const emptyForm = {
  name: '', code: '', price: '', wasPrice: '',
  stock: '', image: '📦', badge: '', description: '', active: true,
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
      name: p.name,
      code: p.code,
      price: String(p.price),
      wasPrice: p.wasPrice ? String(p.wasPrice) : '',
      stock: String(p.stock),
      image: p.image,
      badge: p.badge || '',
      description: '',
      active: p.active,
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

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '900' }}>📦 Products</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            placeholder="🔍 Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', width: '220px' }}
          />
          <button onClick={openAdd}
            style={{ background: '#cc0000', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Add Product
          </button>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '24px', color: '#888' }}>⏳ Loading products...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead style={{ background: '#f9f9f9' }}>
              <tr>
                {['', 'Product', 'Category', 'Price', 'Was Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#888', textTransform: 'uppercase', borderBottom: '1px solid #eee' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '13px 16px', fontSize: '26px' }}>{p.image}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>Code: {p.code}</div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>{p.category?.name}</td>
                  <td style={{ padding: '13px 16px', fontWeight: 'bold' }}>£{Number(p.price).toFixed(2)}</td>
                  <td style={{ padding: '13px 16px', color: '#888' }}>
                    {p.wasPrice ? `£${Number(p.wasPrice).toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding: '13px 16px' }}>{p.stock}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      background: !p.active ? '#eee' : p.stock === 0 ? '#ffebee' : p.stock <= 5 ? '#fff3e0' : '#e8f5e9',
                      color: !p.active ? '#888' : p.stock === 0 ? '#c62828' : p.stock <= 5 ? '#e65100' : '#2e7d32',
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'
                    }}>
                      {!p.active ? 'Inactive' : p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(p)}
                        style={{ background: '#f0f0f0', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        style={{ background: '#ffebee', color: '#cc0000', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>No products found.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '8px', width: '90%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ background: '#222', color: 'white', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', fontWeight: 'bold' }}>
              <span>{editingId ? 'Edit Product' : 'Add New Product'}</span>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Product Name *', key: 'name', placeholder: 'e.g. Claw Hammer 16oz' },
                { label: 'Product Code *', key: 'code', placeholder: 'e.g. 12345' },
                { label: 'Price (£) *', key: 'price', placeholder: '0.00', type: 'number' },
                { label: 'Was Price (£)', key: 'wasPrice', placeholder: '0.00', type: 'number' },
                { label: 'Stock *', key: 'stock', placeholder: '0', type: 'number' },
                { label: 'Image (emoji)', key: 'image', placeholder: '📦' },
                { label: 'Badge (SALE, NEW)', key: 'badge', placeholder: 'optional' },
                { label: 'Description', key: 'description', placeholder: 'optional' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#444', display: 'block', marginBottom: '4px' }}>{label}</label>
                  <input
                    type={type || 'text'}
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                  />
                </div>
              ))}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                Active (visible on site)
              </label>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setModalOpen(false)}
                style={{ background: '#f0f0f0', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ background: '#cc0000', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>
                {saving ? 'Saving...' : '💾 Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
