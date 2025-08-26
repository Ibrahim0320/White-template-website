import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password } = body || {}
  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password required' }), { status: 400 })
  }
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 400 })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, passwordHash } })
  return new Response(JSON.stringify({ id: user.id }), { status: 201 })
}
