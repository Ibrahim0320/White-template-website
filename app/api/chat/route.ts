import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { BRAND } from '@/brand.config'

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body?.messages || []

  const brand = await prisma.brand.findFirst()
  const about = brand?.aboutMd || 'A contemporary fashion label.'
  const products = await prisma.product.findMany({ where: { active: true }, take: 10 })
  const productList = products.map(p => `${p.title} - ${p.priceCents/100} ${p.currency.toUpperCase()}`).join('\n')

  const system = `${BRAND.chatbot.systemPrompt}
Context:
ABOUT:
${about}

PRODUCTS:
${productList}
`

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: system },
      ...messages,
    ],
    temperature: 0.4,
  })

  const reply = completion.choices[0]?.message?.content || "I'm not sure yet."
  return new Response(JSON.stringify({ reply }), { status: 200 })
}
