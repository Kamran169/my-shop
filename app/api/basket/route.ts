import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/app/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
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
  } catch (error) {
    console.error('Basket GET error:', error)
    return NextResponse.json({ items: [], error: String(error) })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
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
  } catch (error) {
    console.error('Basket POST error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
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
  } catch (error) {
    console.error('Basket DELETE error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
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
  } catch (error) {
    console.error('Basket PATCH error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}