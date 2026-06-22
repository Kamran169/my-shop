import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/app/lib/prisma'

// GET — fetch basket items
export async function GET() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ items: [] })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) return NextResponse.json({ items: [] })

  const items = await prisma.basketItem.findMany({
    where: { userId: user.id },
    include: { product: true }
  })

  return NextResponse.json({ items })
}

// POST — add item to basket
export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Please sign in' }, { status: 401 })
  }

  const { productId, quantity } = await request.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const item = await prisma.basketItem.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId: user.id, productId, quantity }
  })

  return NextResponse.json({ item })
}

// DELETE — remove item from basket
export async function DELETE(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Please sign in' }, { status: 401 })
  }

  const { productId } = await request.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await prisma.basketItem.delete({
    where: { userId_productId: { userId: user.id, productId } }
  })

  return NextResponse.json({ success: true })
}

// PATCH — update quantity
export async function PATCH(request: Request) {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Please sign in' }, { status: 401 })
  }

  const { productId, quantity } = await request.json()

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const item = await prisma.basketItem.update({
    where: { userId_productId: { userId: user.id, productId } },
    data: { quantity }
  })

  return NextResponse.json({ item })
}