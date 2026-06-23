import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/app/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: { product: true }
          }
        }
      }
    }
  })

  return NextResponse.json({ user, orders: user?.orders || [] })
}
