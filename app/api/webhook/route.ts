import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/app/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const customerEmail = session.customer_details?.email
    if (!customerEmail) return NextResponse.json({ received: true })

    const user = await prisma.user.findUnique({
      where: { email: customerEmail },
      include: { basketItems: { include: { product: true } } }
    })

    if (!user) return NextResponse.json({ received: true })

    if (user.basketItems.length > 0) {
      const name = session.customer_details?.name || 'Customer'
      const nameParts = name.split(' ')
      const firstName = nameParts[0] || 'Customer'
      const lastName = nameParts.slice(1).join(' ') || 'Customer'

      await prisma.order.create({
        data: {
          userId: user.id,
          total: session.amount_total! / 100,
          status: 'PAID',
          firstName,
          lastName,
          address1: '',
          city: '',
          postcode: '',
          country: 'GB',
          items: {
            create: user.basketItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            }))
          }
        }
      })

      await prisma.basketItem.deleteMany({
        where: { userId: user.id }
      })
    }
  }

  return NextResponse.json({ received: true })
}