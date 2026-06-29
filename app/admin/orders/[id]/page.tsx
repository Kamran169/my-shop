{/* UPDATE STATUS */}
<div
  style={{
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
  }}
>
  <div
    style={{
      background: '#f9f9f9',
      padding: '12px 18px',
      borderBottom: '1px solid #eee',
      fontWeight: 'bold',
      fontSize: '14px',
    }}
  >
    🚚 Update Order Status
  </div>

  <div
    style={{
      padding: '18px',
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
    }}
  >
    {[
      { status: 'PENDING', icon: '⏳' },
      { status: 'PAID', icon: '💳' },
      { status: 'SHIPPED', icon: '🚚' },
      { status: 'DELIVERED', icon: '✅' },
      { status: 'CANCELLED', icon: '❌' },
    ].map(({ status, icon }) => (
      <a
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