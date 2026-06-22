import { prisma } from '../lib/prisma'
import ProductsClient from './ProductsClient'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  })
  return <ProductsClient products={products} />
}