import { prisma } from '@/app/lib/prisma'

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      items: { include: { product: true } }
    }
  })

  const statusColor = (status: string) => {
    switch(status) {
      case 'PAID': return { bg: '#e3f2fd', color: '#1565c0' }
      case 'SHIPPED': return { bg: '#fff3e0', color: '#e65100' }
      case 'DELIVERED': return { bg: '#e8f5e9', color: '#2e7d32' }
      case 'CANCELLED': return { bg: '#ffebee', color: '#c62828' }
      default: return { bg: '#f5f5f5', color: '#666' }
    }
  }

  return (
    <div style={{ padding: '28px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '24px' }}>🛒 Orders ({orders.length})</h1>

      <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: '#f9f9f9' }}>
            <tr>
              {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#888', textTransform: 'uppercase', borderBottom: '1px solid #eee' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const s = statusColor(order.status)
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '13px 16px', fontWeight: 'bold' }}>
                    #TF-{String(order.id).padStart(6, '0')}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ fontWeight: 'bold' }}>{order.firstName} {order.lastName}</div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>{order.user?.email}</div>
                  </td>
                  <td style={{ padding: '13px 16px' }}>{order.items.length} items</td>
                  <td style={{ padding: '13px 16px', fontWeight: 'bold', color: '#cc0000' }}>
                    £{Number(order.total).toFixed(2)}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', color: '#888' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              )
            })}
            {orders.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
