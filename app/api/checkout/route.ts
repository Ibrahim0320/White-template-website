import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

type Item = { productId: string; quantity: number }

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const items: Item[] =
      body?.items?.map((i: any) => ({ productId: i.productId, quantity: i.quantity })) || []
    if (!items.length) {
      return new Response(JSON.stringify({ error: 'No items' }), { status: 400 })
    }

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '')

    // Fetch & validate products
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) }, active: true },
    })
    const map = new Map(products.map((p) => [p.id, p]))

    const line_items = items.map((i) => {
      const p = map.get(i.productId)
      if (!p) throw new Error('Invalid product in cart')

      // Stripe requires absolute URLs for images
      const rel = p.images?.[0]
      const img =
        rel && /^https?:\/\//i.test(rel) ? rel : rel ? `${baseUrl}${rel.startsWith('/') ? '' : '/'}${rel}` : undefined

      return {
        quantity: i.quantity,
        price_data: {
          currency: (p.currency || 'usd').toLowerCase(),
          unit_amount: p.priceCents, // cents (integer)
          product_data: {
            name: p.title,
            ...(img ? { images: [img] } : {}), // only include if absolute
          },
        },
      }
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${baseUrl}/account?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'SE', 'GB', 'DE', 'FR', 'NL', 'DK', 'NO'],
      },
      // optional:
      // automatic_tax: { enabled: true },
    })

    return new Response(JSON.stringify({ url: session.url }), { status: 200 })
  } catch (err: any) {
    // Surface the real Stripe message to the client to debug quickly
    const message = err?.raw?.message || err?.message || 'Checkout failed'
    console.error('Checkout error:', message)
    return new Response(JSON.stringify({ error: message }), { status: 400 })
  }
}
