'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'login' | 'register'>('login')

  // Login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Register state
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPassword2, setRegPassword2] = useState('')
  const [regError, setRegError] = useState('')
  const [regSuccess, setRegSuccess] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    const result = await signIn('credentials', {
      email: loginEmail,
      password: loginPassword,
      redirect: false,
    })

    if (result?.error) {
      setLoginError('❌ Incorrect email or password. Please try again.')
      setLoginLoading(false)
    } else {
      router.push('/')
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegLoading(true)
    setRegError('')
    setRegSuccess('')

    if (regPassword !== regPassword2) {
      setRegError('❌ Passwords do not match!')
      setRegLoading(false)
      return
    }

    if (regPassword.length < 8) {
      setRegError('❌ Password must be at least 8 characters.')
      setRegLoading(false)
      return
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
      })
    })

    const data = await res.json()

    if (!res.ok) {
      setRegError('❌ ' + data.error)
      setRegLoading(false)
    } else {
      setRegSuccess('✅ Account created! Signing you in...')
      await signIn('credentials', {
        email: regEmail,
        password: regPassword,
        redirect: false,
      })
      router.push('/')
    }
  }

  const inputStyle = {
    padding:'11px 12px', border:'1px solid #ddd',
    borderRadius:'4px', fontSize:'14px',
    outline:'none', width:'100%'
  }
  const labelStyle = {
    fontSize:'13px', fontWeight:'bold' as const, color:'#444',
    display:'block', marginBottom:'6px'
  }

  return (
    <div style={{maxWidth:'980px', margin:'40px auto', padding:'0 20px', display:'flex', gap:'24px', alignItems:'flex-start', flexWrap:'wrap'}}>

      {/* AUTH CARD */}
      <div style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', overflow:'hidden', flex:1, minWidth:'280px'}}>

        {/* TITLE */}
        <div style={{background:'#222', color:'white', padding:'14px 20px', fontSize:'16px', fontWeight:'bold'}}>
          {tab === 'login' ? '👤 Sign In to Your Account' : '📝 Create Your Account'}
        </div>

        {/* TABS */}
        <div style={{display:'flex', borderBottom:'1px solid #ddd'}}>
          <button onClick={() => setTab('login')}
            style={{flex:1, padding:'12px', fontWeight:'bold', fontSize:'14px', border:'none', cursor:'pointer', background: tab === 'login' ? '#cc0000' : '#f4f4f4', color: tab === 'login' ? 'white' : '#222'}}>
            Sign In
          </button>
          <button onClick={() => setTab('register')}
            style={{flex:1, padding:'12px', fontWeight:'bold', fontSize:'14px', border:'none', cursor:'pointer', background: tab === 'register' ? '#cc0000' : '#f4f4f4', color: tab === 'register' ? 'white' : '#222'}}>
            Create Account
          </button>
        </div>

        <div style={{padding:'24px'}}>

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              {loginError && (
                <div style={{background:'#ffebee', border:'1px solid #ffcdd2', borderRadius:'4px', padding:'12px', color:'#c62828', fontSize:'13px', marginBottom:'16px'}}>
                  {loginError}
                </div>
              )}

              <div style={{marginBottom:'16px'}}>
                <label style={labelStyle}>Email Address *</label>
                <input type="email" required value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="john@example.com" style={inputStyle} />
              </div>

              <div style={{marginBottom:'8px'}}>
                <label style={labelStyle}>Password *</label>
                <input type="password" required value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="Enter your password" style={inputStyle} />
              </div>

              <div style={{textAlign:'right', marginBottom:'20px'}}>
                <a href="#" style={{color:'#cc0000', fontSize:'13px', textDecoration:'none'}}>Forgot your password?</a>
              </div>

              <button type="submit" disabled={loginLoading}
                style={{background:'#cc0000', color:'white', border:'none', width:'100%', padding:'13px', fontSize:'15px', fontWeight:'bold', borderRadius:'4px', cursor:'pointer', marginBottom:'12px'}}>
                {loginLoading ? 'Signing in...' : 'Sign In →'}
              </button>

              <div style={{textAlign:'center', fontSize:'13px', color:'#888', margin:'12px 0'}}>or</div>

              <button type="button" onClick={() => signIn('google')}
                style={{background:'white', border:'1px solid #ddd', width:'100%', padding:'11px', fontSize:'14px', fontWeight:'bold', borderRadius:'4px', cursor:'pointer', marginBottom:'10px'}}>
                🔵 Continue with Google
              </button>
            </form>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              {regError && (
                <div style={{background:'#ffebee', border:'1px solid #ffcdd2', borderRadius:'4px', padding:'12px', color:'#c62828', fontSize:'13px', marginBottom:'16px'}}>
                  {regError}
                </div>
              )}
              {regSuccess && (
                <div style={{background:'#e8f5e9', border:'1px solid #c8e6c9', borderRadius:'4px', padding:'12px', color:'#2e7d32', fontSize:'13px', marginBottom:'16px'}}>
                  {regSuccess}
                </div>
              )}

              <div style={{display:'flex', gap:'12px', marginBottom:'16px'}}>
                <div style={{flex:1}}>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" required value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="John Smith" style={inputStyle} />
                </div>
              </div>

              <div style={{marginBottom:'16px'}}>
                <label style={labelStyle}>Email Address *</label>
                <input type="email" required value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="john@example.com" style={inputStyle} />
              </div>

              <div style={{marginBottom:'16px'}}>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  placeholder="07700 000000" style={inputStyle} />
              </div>

              <div style={{marginBottom:'16px'}}>
                <label style={labelStyle}>Password * (min 8 characters)</label>
                <input type="password" required value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Create a password" style={inputStyle} />
              </div>

              <div style={{marginBottom:'20px'}}>
                <label style={labelStyle}>Confirm Password *</label>
                <input type="password" required value={regPassword2}
                  onChange={e => setRegPassword2(e.target.value)}
                  placeholder="Repeat your password" style={inputStyle} />
              </div>

              <button type="submit" disabled={regLoading}
                style={{background:'#cc0000', color:'white', border:'none', width:'100%', padding:'13px', fontSize:'15px', fontWeight:'bold', borderRadius:'4px', cursor:'pointer'}}>
                {regLoading ? 'Creating account...' : 'Create Account →'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* BENEFITS */}
      <div style={{background:'white', border:'1px solid #ddd', borderRadius:'6px', padding:'24px', flex:'0 0 240px'}}>
        <h3 style={{fontSize:'16px', fontWeight:'bold', marginBottom:'16px', borderLeft:'4px solid #cc0000', paddingLeft:'10px'}}>
          Why Create an Account?
        </h3>
        {[
          ['📦', 'Track Your Orders', 'Live updates on all deliveries'],
          ['⚡', 'Faster Checkout', 'Save your details for next time'],
          ['⭐', 'Loyalty Rewards', 'Earn points on every purchase'],
          ['🏷️', 'Exclusive Deals', 'Members-only prices'],
          ['📋', 'Order History', 'Reorder your favourite products'],
          ['🔒', 'Secure Account', 'Your data is always protected'],
        ].map(([icon, title, desc], i) => (
          <div key={i} style={{display:'flex', gap:'10px', marginBottom:'16px', fontSize:'13px', color:'#444'}}>
            <span style={{fontSize:'22px'}}>{icon}</span>
            <div>
              <strong style={{display:'block', color:'#222'}}>{title}</strong>
              {desc}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}