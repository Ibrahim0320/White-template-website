import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const brand = await prisma.brand.upsert({
    where: { slug: 'monolith' },
    create: {
      name: 'Monolith Atelier',
      slug: 'monolith',
      aboutMd: 'Monolith Atelier is a study in sculptural silhouettes and essential neutrals. Designed in Stockholm. Made responsibly.',
      chatbotConfig: { tone: 'concise' } as any,
    },
    update: {},
  })

  const products = [
    {
      title: 'Structured Wool Coat',
      slug: 'structured-wool-coat',
      description: 'Double-faced wool. Oversized shoulders. Hidden placket.',
      priceCents: 69000,
      currency: 'usd',
      images: ['/images/placeholder.svg'],
      active: true,
      stock: 15,
    },
    {
      title: 'Boxy Cotton Tee',
      slug: 'boxy-cotton-tee',
      description: 'Heavyweight jersey. Relaxed fit.',
      priceCents: 9000,
      currency: 'usd',
      images: ['/images/placeholder.svg'],
      active: true,
      stock: 120,
    },
    {
      title: 'Split-Hem Trousers',
      slug: 'split-hem-trousers',
      description: 'Crisp twill with subtle flare.',
      priceCents: 18000,
      currency: 'usd',
      images: ['/images/placeholder.svg'],
      active: true,
      stock: 40,
    },
    {
      title: 'Stacked Leather Boots',
      slug: 'stacked-leather-boots',
      description: 'Stacked heel. Square toe. Premium calf leather.',
      priceCents: 52000,
      currency: 'usd',
      images: ['/images/placeholder.svg'],
      active: true,
      stock: 12,
    },
  ]
  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, create: p as any, update: p as any })
  }

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (email && password) {
    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.user.upsert({
      where: { email },
      create: { email, name: 'Admin', passwordHash },
      update: {},
    })
  }

  console.log('Seed complete')
}

main().finally(() => prisma.$disconnect())
