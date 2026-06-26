import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { name, code, category, price, wasPrice, stock, icon, badge, description, active } = body

  const product = await prisma.product.update({
    where: { id: parseInt(params.id) },
    data: {
      name,
      code,
      category,
      price: parseFloat(price),
      wasPrice: wasPrice ? parseFloat(wasPrice) : null,
      stock: parseInt(stock),
      icon,
      badge: badge || null,
      description: description || null,
      active: active ?? true,
    },
  })
  return NextResponse.json(product)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.product.delete({
    where: { id: parseInt(params.id) },
  })
  return NextResponse.json({ success: true })
}