import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, code, category, price, wasPrice, stock, badge, description, active } = body

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const product = await prisma.product.create({
    data: {
      name,
      code,
      slug,
      category,
      price: parseFloat(price),
      wasPrice: wasPrice ? parseFloat(wasPrice) : null,
      stock: parseInt(stock) || 0,
      badge: badge || null,
      description: description || null,
      active: active ?? true,
      image: '',
    }
  })
  return NextResponse.json(product)
}