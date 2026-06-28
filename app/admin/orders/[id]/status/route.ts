import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  if (!status) {
    return NextResponse.json({ error: 'Status required' }, { status: 400 })
  }

  await prisma.order.update({
    where: { id: parseInt(id) },
    data: { status: status as any }
  })

  return NextResponse.redirect(new URL(`/admin/orders/${id}`, request.url))
}