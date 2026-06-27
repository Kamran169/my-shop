import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      name: body.name,
      price: parseFloat(body.price),
      wasPrice: body.wasPrice ? parseFloat(body.wasPrice) : null,
      category: body.category,
      stock: parseInt(body.stock),
      badge: body.badge,
      active: body.active,
    }
  })
  return NextResponse.json(product)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.product.delete({
    where: { id: parseInt(id) }
  })
  return NextResponse.json({ success: true })
}