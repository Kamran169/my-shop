'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/products', icon: '📦', label: 'Products' },
  { href: '/admin/orders', icon: '🛒', label: 'Orders' },
  { href: '/admin/customers', icon: '👥', label: 'Customers' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f0f0' }}>
      {/* SIDEBAR */}
      <div style={{ width: '220px', background: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
          <div style={{ fontSize: '20px', fontWeight: '900', color: 'white' }}>
            Trade<span style={{ color: '#ffe000' }}>fix</span>
          </div>
          <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Admin Panel</div>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {menuItems.map(item => (
            <Link key={item.href} href={item.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 20px', textDecoration: 'none', fontSize: '14px',
                background: pathname === item.href ? '#cc0000' : 'none',
                color: pathname === item.href ? 'white' : '#bbb',
              }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #333' }}>
          <Link href="/" style={{ color: '#888', textDecoration: 'none', fontSize: '13px' }}>
            🌐 View Site
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: '220px', flex: 1 }}>
        {children}
      </div>
    </div>
  )
}
