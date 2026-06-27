import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories first
  const toolsCategory = await prisma.category.upsert({
    where: { slug: 'power-tools' },
    update: {},
    create: { name: 'Power Tools', slug: 'power-tools' }
  })

  const handToolsCategory = await prisma.category.upsert({
    where: { slug: 'hand-tools' },
    update: {},
    create: { name: 'Hand Tools', slug: 'hand-tools' }
  })

  const electricalCategory = await prisma.category.upsert({
    where: { slug: 'electrical' },
    update: {},
    create: { name: 'Electrical', slug: 'electrical' }
  })

  const ladderCategory = await prisma.category.upsert({
    where: { slug: 'storage-ladders' },
    update: {},
    create: { name: 'Storage & Ladders', slug: 'storage-ladders' }
  })

  // Create products
  await prisma.product.deleteMany()

  await prisma.product.createMany({
    data: [
      { name: '18V Cordless Drill Driver', slug: '18v-cordless-drill-driver', code: '34567', categoryId: toolsCategory.id, price: 69.99, wasPrice: 89.99, stock: 42, image: '⚡', badge: 'SALE' },
      { name: 'Heavy Duty Claw Hammer 16oz', slug: 'heavy-duty-claw-hammer-16oz', code: '12345', categoryId: handToolsCategory.id, price: 12.99, wasPrice: 18.99, stock: 118, image: '🔨', badge: 'NEW' },
      { name: 'Circular Saw 185mm 1200W', slug: 'circular-saw-185mm-1200w', code: '56789', categoryId: toolsCategory.id, price: 64.99, wasPrice: 79.99, stock: 5, image: '🪚', badge: 'SALE' },
      { name: 'LED GU10 Bulbs 6W Pack of 10', slug: 'led-gu10-bulbs-6w-pack-10', code: '45678', categoryId: electricalCategory.id, price: 14.99, wasPrice: 19.99, stock: 200, image: '💡', badge: '' },
      { name: 'Combination Spanner Set 8pc', slug: 'combination-spanner-set-8pc', code: '78901', categoryId: handToolsCategory.id, price: 14.99, wasPrice: 22.99, stock: 64, image: '🔧', badge: 'SALE' },
      { name: 'Screwdriver Set 10pc Magnetic', slug: 'screwdriver-set-10pc-magnetic', code: '89012', categoryId: handToolsCategory.id, price: 9.99, wasPrice: null, stock: 95, image: '🪛', badge: '' },
      { name: '18V Li-Ion Battery 5.0Ah', slug: '18v-li-ion-battery-5ah', code: '90123', categoryId: toolsCategory.id, price: 44.99, wasPrice: null, stock: 8, image: '🔋', badge: 'NEW' },
      { name: 'Aluminium Step Ladder 3 Tread', slug: 'aluminium-step-ladder-3-tread', code: '01234', categoryId: ladderCategory.id, price: 29.99, wasPrice: 39.99, stock: 3, image: '🪜', badge: 'SALE' },
    ]
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())