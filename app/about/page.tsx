import { prisma } from '@/lib/prisma'

export default async function AboutPage() {
  const brand = await prisma.brand.findFirst()
  return (
    <main className="container py-12 prose prose-gray max-w-3xl">
      <h1>About</h1>
      <div className="whitespace-pre-wrap">{brand?.aboutMd || 'Tell your story here. Update this later in the Brand Studio.'}</div>
    </main>
  )
}
