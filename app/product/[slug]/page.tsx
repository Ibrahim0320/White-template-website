import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import AddToCart from './purchase'
import { formatPrice } from '@/lib/utils'

export default async function ProductPage({ params }: { params: { slug: string }}) {
  const p = await prisma.product.findUnique({ where: { slug: params.slug } })
  if (!p || !p.active) notFound()

  return (
    <main className="container py-12 grid md:grid-cols-2 gap-8">
      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
        {p.images[0] ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>}
      </div>
      <div>
        <h1 className="text-3xl font-semibold">{p.title}</h1>
        <div className="text-xl mt-2">{formatPrice(p.priceCents, p.currency.toUpperCase())}</div>
        <p className="mt-6 text-sm text-gray-700 whitespace-pre-wrap">{p.description}</p>
        <div className="mt-6">
          <AddToCart id={p.id} title={p.title} priceCents={p.priceCents} image={p.images[0]} />
        </div>
      </div>
    </main>
  )
}
