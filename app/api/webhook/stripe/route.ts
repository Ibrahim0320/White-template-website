import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') as string
  const raw = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET as string)
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const items = JSON.parse(session.metadata?.items || '[]')
    const currency = session.currency?.toUpperCase?.() || 'USD'
    const totalCents = session.amount_total || 0
    const email = session.customer_details?.email || session.customer_email

    await prisma.order.create({
      data: {
        email: email || 'unknown@example.com',
        lineItems: items,
        subtotalCents: totalCents, // simplified: Stripe returns total; no shipping calc here
        totalCents: totalCents,
        currency,
        stripeSession: session.id,
        status: 'paid',
      }
    })
  }

  return new Response('ok', { status: 200 })
}

export const dynamic = 'force-dynamic'
