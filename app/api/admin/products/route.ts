import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { generateSlug } from '@/utils/slug'

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, code, price, wasPrice, stock, image, badge, description, active } = body

  const slug = generateSlug(name)

  let category = await prisma.category.findFirst({
    where: { name: 'Power Tools' }
  })

  if (!category) {
    category = await prisma.category.create({
      data: { name: 'Power Tools', slug: 'power-tools' }
    })
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      code,
      categoryId: category.id,
      price: parseFloat(price),
      wasPrice: wasPrice ? parseFloat(wasPrice) : null,
      stock: parseInt(stock) || 0,
      image: image || '📦',
      badge: badge || null,
      description: description || null,
      active: active ?? true,
    }
  })
  return NextResponse.json(product)
}
