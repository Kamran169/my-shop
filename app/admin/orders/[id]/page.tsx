import { prisma } from '@/app/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      user: true,
      items: { include: { product: true } }
    }
  })

  if (!order) notFound()

  const statusColor = (status: string) => {
    switch(status) {
      case 'PAID': return { bg: '#e3f2fd', color: '#1565c0' }
      case 'SHIPPED': return { bg: '#fff3e0', color: '#e65100' }
      case 'DELIVERED': return { bg: '#e8f5e9', color: '#2e7d32' }
      case 'CANCELLED': return { bg: '#ffebee', color: '#c62828' }
      default: return { bg: '#f5f5f5', color: '#666' }
    }
  }

  const s = statusColor(order.status)
  const subtotal = order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const vat = subtotal * 0.2 / 1.2
  const exVat = subtotal - vat

  return (
    <div style={{ padding: '28px', maxWidth: '900px' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link href="/admin/orders" style={{ color: '#cc0000', textDecoration: 'none', fontSize: '13px' }}>
            ← Back to Orders
          </Link>
          <h1 style={{ fontSize: '22px', fontWeight: '900', marginTop: '4px' }}>
            Order #TF-{String(order.id).padStart(6, '0')}
          </h1>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
        <span style={{ background: s.bg, color: s.color, padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          {order.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

        {/* CUSTOMER DETAILS */}
        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ background: '#f9f9f9', padding: '12px 18px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '14px' }}>
            👤 Customer Details
          </div>
          <div style={{ padding: '16px 18px' }}>
            {[
              ['Name', `${order.firstName} ${order.lastName}`],
              ['Email', order.user?.email || 'Guest'],
              ['Phone', order.user?.phone || 'Not provided'],
              ['Customer ID', `#${order.userId || 'Guest'}`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: '13px' }}>
                <span style={{ color: '#888' }}>{label}</span>
                <span style={{ fontWeight: 'bold' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DELIVERY ADDRESS */}
        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ background: '#f9f9f9', padding: '12px 18px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '14px' }}>
            📦 Delivery Address
          </div>
          <div style={{ padding: '16px 18px', fontSize: '13px', lineHeight: '1.8' }}>
            <div style={{ fontWeight: 'bold' }}>{order.firstName} {order.lastName}</div>
            <div>{order.address1 || 'Not provided'}</div>
            {order.address2 && <div>{order.address2}</div>}
            <div>{order.city || 'Not provided'}</div>
            <div>{order.postcode || 'Not provided'}</div>
            <div>{order.country || 'GB'}</div>
          </div>
        </div>

      </div>

      {/* ORDER ITEMS */}
      <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{ background: '#f9f9f9', padding: '12px 18px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '14px' }}>
          🛒 Order Items
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              {['Product', 'Code', 'Price', 'Qty', 'Total'].map(h => (
                <th key={h} style={{ padding: '10px 18px', textAlign: 'left', color: '#888', fontSize: '11px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td style={{ padding: '12px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>{item.product.image}</span>
                    <span style={{ fontWeight: 'bold' }}>{item.product.name}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 18px', color: '#888' }}>{item.product.code}</td>
                <td style={{ padding: '12px 18px' }}>£{Number(item.price).toFixed(2)}</td>
                <td style={{ padding: '12px 18px' }}>{item.quantity}</td>
                <td style={{ padding: '12px 18px', fontWeight: 'bold' }}>
                  £{(Number(item.price) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS */}
        <div style={{ padding: '16px 18px', borderTop: '2px solid #eee' }}>
          {[
            ['Subtotal (ex. VAT)', `£${exVat.toFixed(2)}`],
            ['VAT (20%)', `£${vat.toFixed(2)}`],
            ['Delivery', 'FREE'],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
              <span style={{ color: '#888' }}>{label}</span>
              <span>{value}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '900', borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '4px' }}>
            <span>Total</span>
            <span style={{ color: '#cc0000' }}>£{Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* UPDATE STATUS */}
      <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ background: '#f9f9f9', padding: '12px 18px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '14px' }}>
          🚚 Update Order Status
        </div>
        <div style={{ padding: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { status: 'PENDING', icon: '⏳' },
            { status: 'PAID', icon: '💳' },
            { status: 'SHIPPED', icon: '🚚' },
            { status: 'DELIVERED', icon: '✅' },
            { status: 'CANCELLED', icon: '❌' },
          ].map(({ status, icon }) => (
            
              key={status}
              href={`/api/admin/orders/${order.id}/status?status=${status}`}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '13px',
                textDecoration: 'none',
                background: order.status === status ? '#cc0000' : '#f0f0f0',
                color: order.status === status ? 'white' : '#222',
                display: 'inline-block',
              }}
            >
              {icon} {status}
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}