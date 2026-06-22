import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.product.createMany({
    data: [
      { name:'18V Cordless Drill Driver', code:'34567', category:'Power Tools', price:69.99, wasPrice:89.99, stock:42, icon:'⚡', badge:'SALE' },
      { name:'Heavy Duty Claw Hammer 16oz', code:'12345', category:'Hand Tools', price:12.99, wasPrice:18.99, stock:118, icon:'🔨', badge:'NEW' },
      { name:'Circular Saw 185mm 1200W', code:'56789', category:'Power Tools', price:64.99, wasPrice:79.99, stock:5, icon:'🪚', badge:'SALE' },
      { name:'LED GU10 Bulbs 6W Pack of 10', code:'45678', category:'Electrical', price:14.99, wasPrice:19.99, stock:200, icon:'💡', badge:'' },
      { name:'Combination Spanner Set 8pc', code:'78901', category:'Hand Tools', price:14.99, wasPrice:22.99, stock:64, icon:'🔧', badge:'SALE' },
      { name:'Screwdriver Set 10pc Magnetic', code:'89012', category:'Hand Tools', price:9.99, wasPrice:null, stock:95, icon:'🪛', badge:'' },
      { name:'18V Li-Ion Battery 5.0Ah', code:'90123', category:'Power Tools', price:44.99, wasPrice:null, stock:8, icon:'🔋', badge:'NEW' },
      { name:'Aluminium Step Ladder 3 Tread', code:'01234', category:'Storage & Ladders', price:29.99, wasPrice:39.99, stock:3, icon:'🪜', badge:'SALE' },
    ]
  })
  console.log('✅ Products added to database!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())