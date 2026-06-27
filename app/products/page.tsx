import { prisma } from '../lib/prisma'
import ProductsClient from './ProductsClient'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  const serialized = products.map(p => ({
    id: p.id,
    name: p.name,
    code: p.code,
    category: p.category.name,
    price: Number(p.price),
    wasPrice: p.wasPrice ? Number(p.wasPrice) : null,
    stock: p.stock,
    icon: p.image,
    badge: p.badge,
    active: p.active,
  }))

  return <ProductsClient products={serialized} />
}