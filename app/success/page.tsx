import Link from 'next/link'
export default function SuccessPage() {
  return (
    <div style={{maxWidth:'600px', margin:'80px auto', padding:'0 20px', textAlign:'center'}}>
      <div style={{background:'white', border:'1px solid #ddd', borderRadius:'10px', padding:'50px'}}>
        <div style={{fontSize:'70px', marginBottom:'20px'}}>✅</div>
        <h1 style={{fontSize:'28px', fontWeight:'900', marginBottom:'12px', color:'#007700'}}>
          Order Confirmed!
        </h1>
        <p style={{color:'#555', fontSize:'16px', marginBottom:'8px'}}>
          Thank you for your order!
        </p>
        <p style={{color:'#888', fontSize:'14px', marginBottom:'30px'}}>
          A confirmation email has been sent to you.
        </p>
        <div style={{background:'#f9f9f9', borderRadius:'6px', padding:'16px', marginBottom:'24px', fontSize:'13px', color:'#666'}}>
          Your order is being processed and will be dispatched soon.
        </div>
        <Link href="/products"
          style={{background:'#cc0000', color:'white', padding:'14px 32px', borderRadius:'4px', fontWeight:'bold', fontSize:'15px', textDecoration:'none', display:'inline-block'}}>
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
