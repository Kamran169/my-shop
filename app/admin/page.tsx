import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [products, orders, customers] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true, items: true }
  })

  const lowStock = await prisma.product.findMany({
    where: { stock: { lte: 10 } },
    orderBy: { stock: 'asc' },
    take: 5
  })

  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true }
  })

  return (
    <div style={{ padding: '28px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '24px' }}>📊 Dashboard</h1>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Revenue', value: `£${Number(totalRevenue._sum.total || 0).toFixed(2)}`, color: '#cc0000', icon: '💷' },
          { label: 'Total Orders', value: orders, color: '#007700', icon: '🛒' },
          { label: 'Total Products', value: products, color: '#0055cc', icon: '📦' },
          { label: 'Total Customers', value: customers, color: '#ff6600', icon: '👥' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '8px', padding: '20px', borderLeft: `4px solid ${stat.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '900' }}>{stat.value}</div>
            </div>
            <div style={{ fontSize: '36px', opacity: 0.3 }}>{stat.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* RECENT ORDERS */}
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>🛒 Recent Orders</h3>
            <Link href="/admin/orders" style={{ color: '#cc0000', fontSize: '13px', textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentOrders.map(order => (
            <div key={order.id} style={{ padding: '12px 18px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>#{String(order.id).padStart(6, '0')}</div>
                <div style={{ color: '#888' }}>{order.firstName} {order.lastName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#cc0000' }}>£{Number(order.total).toFixed(2)}</div>
                <div style={{ color: '#888' }}>{order.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* LOW STOCK */}
        <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold' }}>⚠️ Low Stock</h3>
            <Link href="/admin/products" style={{ color: '#cc0000', fontSize: '13px', textDecoration: 'none' }}>View all →</Link>
          </div>
          {lowStock.map(product => (
            <div key={product.id} style={{ padding: '12px 18px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <div style={{ fontWeight: 'bold' }}>{product.name}</div>
              <div style={{ color: product.stock === 0 ? '#cc0000' : '#ff6600', fontWeight: 'bold' }}>
                {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
