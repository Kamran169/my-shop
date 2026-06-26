import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, code, category, price, wasPrice, stock, icon, badge, description, active } = body

  if (!name || !code || !category || !price || !icon) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      name,
      code,
      category,
      price: parseFloat(price),
      wasPrice: wasPrice ? parseFloat(wasPrice) : null,
      stock: parseInt(stock) || 0,
      icon,
      badge: badge || null,
      description: description || null,
      active: active ?? true,
    },
  })
  return NextResponse.json(product)
}