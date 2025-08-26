'use client'
import { useCart } from '@/lib/cart'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, remove, setQty, clear } = useCart()
  const subtotal = items.reduce((n, i) => n + i.priceCents * i.quantity, 0)

  async function checkout() {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else alert('Checkout failed.')
  }

  return (
    <main className="container py-12">
      <h1 className="text-3xl font-semibold mb-8">Cart</h1>
      {items.length === 0 ? <p>Your cart is empty.</p> : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {items.map(i => (
              <div key={i.productId} className="flex items-center gap-4 border rounded-xl p-3">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                  {i.image ? <img src={i.image} alt={i.title} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{i.title}</div>
                  <div className="text-sm text-gray-500">{formatPrice(i.priceCents)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="btn btn-ghost" onClick={() => setQty(i.productId, Math.max(1, i.quantity - 1))}>-</button>
                    <span>{i.quantity}</span>
                    <button className="btn btn-ghost" onClick={() => setQty(i.productId, i.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="text-sm underline" onClick={() => remove(i.productId)}>Remove</button>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <button className="btn btn-primary w-full mt-4" onClick={checkout}>Checkout</button>
            <button className="btn w-full mt-2" onClick={clear}>Clear cart</button>
          </div>
        </div>
      )}
    </main>
  )
}
