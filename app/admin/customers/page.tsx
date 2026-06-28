import { prisma } from '@/app/lib/prisma'

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: true,
      _count: { select: { orders: true } }
    }
  })

  return (
    <div style={{ padding: '28px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '900', marginBottom: '24px' }}>👥 Customers ({customers.length})</h1>

      <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead style={{ background: '#f9f9f9' }}>
            <tr>
              {['Name', 'Email', 'Role', 'Orders', 'Total Spent', 'Joined'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', color: '#888', textTransform: 'uppercase', borderBottom: '1px solid #eee' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => {
              const totalSpent = customer.orders.reduce((sum, o) => sum + Number(o.total), 0)
              return (
                <tr key={customer.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '13px 16px', fontWeight: 'bold' }}>{customer.name}</td>
                  <td style={{ padding: '13px 16px', color: '#555' }}>{customer.email}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      background: customer.role === 'ADMIN' ? '#ffebee' : '#e3f2fd',
                      color: customer.role === 'ADMIN' ? '#cc0000' : '#1565c0',
                      padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'
                    }}>
                      {customer.role}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px' }}>{customer._count.orders}</td>
                  <td style={{ padding: '13px 16px', fontWeight: 'bold', color: '#cc0000' }}>
                    £{totalSpent.toFixed(2)}
                  </td>
                  <td style={{ padding: '13px 16px', color: '#888' }}>
                    {new Date(customer.createdAt).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              )
            })}
            {customers.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
