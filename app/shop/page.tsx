import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default async function ShopPage() {
  const products = await prisma.product.findMany({ where: { active: true }, orderBy: { createdAt: 'desc' } })
  return (
    <main className="container py-12">
      <h1 className="text-3xl font-semibold mb-8">Shop</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(p => (
          <Link key={p.id} href={`/product/${p.slug}`} className="group">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {p.images[0] ? (
                <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
              )}
            </div>
            <div className="mt-3 text-sm">
              <div>{p.title}</div>
              <div className="text-gray-500">{formatPrice(p.priceCents, p.currency.toUpperCase())}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
