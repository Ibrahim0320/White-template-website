'use client'
import { useCart } from '@/lib/cart'

export default function AddToCart({ id, title, priceCents, image }: { id: string, title: string, priceCents: number, image?: string }) {
  const add = useCart(s => s.add)
  return (
    <button className="btn btn-primary" onClick={() => add({ productId: id, title, priceCents, image }, 1)}>Add to cart</button>
  )
}
