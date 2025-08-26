import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/signin')

  const orders = await prisma.order.findMany({
    where: { OR: [{ userId: (session.user as any).id }, { email: session.user.email }] },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="container py-12">
      <h1 className="text-3xl font-semibold mb-6">Your orders</h1>
      {orders.length === 0 ? <p>No orders yet.</p> : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">{o.createdAt.toDateString()}</div>
              <div className="font-medium">{formatPrice(o.totalCents, o.currency.toUpperCase())}</div>
              <div className="text-sm mt-2">Status: {o.status}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
