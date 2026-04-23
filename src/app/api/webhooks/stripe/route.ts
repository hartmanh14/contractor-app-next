import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // TODO: handle successful payment
      break
    case 'customer.subscription.updated':
      // TODO: handle subscription change
      break
    case 'customer.subscription.deleted':
      // TODO: handle cancellation
      break
  }

  return NextResponse.json({ received: true })
}
