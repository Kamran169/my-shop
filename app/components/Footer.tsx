export default function Footer() {
  const columns = [
    ['Customer Services', ['Contact Us','Returns','FAQs','Track My Order']],
    ['Shopping With Us', ['Delivery Info','Click & Collect','Find a Store','Trade Account']],
    ['About Us', ['Our Story','Careers','Sustainability','Press']],
    ['Follow Us', ['📘 Facebook','🐦 Twitter / X','📸 Instagram','▶️ YouTube']],
  ]

  return (
    <footer style={{background:'#222', color:'#ccc', marginTop:'40px'}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'30px', padding:'40px', maxWidth:'1200px', margin:'0 auto'}}>
        {columns.map(([title, links], i) => (
          <div key={i}>
            <h4 style={{color:'white', marginBottom:'14px', fontSize:'14px'}}>{title as string}</h4>
            {(links as string[]).map((link, j) => (
              <a key={j} href="#" style={{display:'block', color:'#aaa', textDecoration:'none', fontSize:'13px', marginBottom:'8px'}}>{link}</a>
            ))}
          </div>
        ))}
      </div>
      <div style={{background:'#111', textAlign:'center', padding:'14px', fontSize:'12px', color:'#666'}}>
        © 2026 Tradefix Ltd. All rights reserved. | Secure payments | VAT No: 123 4567 89
      </div>
    </footer>
  )
}