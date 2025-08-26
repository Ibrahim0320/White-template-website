import Image from 'next/image'
import Link from 'next/link'
import { BRAND } from '@/brand.config'
import ChatbotWidget from '@/components/chatbot/widget'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

export default async function HomePage() {
  const products = await prisma.product.findMany({ where: { active: true }, take: 4, orderBy: { createdAt: 'desc' }})

  return (
    <main>
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {BRAND.hero.type === 'video' ? (
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src={BRAND.hero.src} type="video/mp4" />
          </video>
        ) : (
          <Image src={BRAND.hero.src} alt="Hero" fill priority className="object-cover" />
        )}
        <div className="relative z-10 text-white text-center drop-shadow-lg">
          <h1 className="text-4xl md:text-6xl font-semibold">{BRAND.hero.heading}</h1>
          <p className="mt-3 text-lg opacity-90">{BRAND.hero.subheading}</p>
          <Link href={BRAND.hero.cta.href} className="btn btn-primary mt-6">{BRAND.hero.cta.label}</Link>
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </section>

      <section className="container py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-medium">Featured</h2>
          <Link href="/shop" className="text-sm underline">View all</Link>
        </div>
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
      </section>
      <ChatbotWidget />
    </main>
  )
}
