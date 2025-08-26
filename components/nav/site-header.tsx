'use client'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useCart } from '@/lib/cart'

export function SiteHeader() {
  const { data: session } = useSession()
  const items = useCart(s => s.items)
  const count = items.reduce((n, i) => n + i.quantity, 0)

  return (
    <header className="border-b">
      <div className="container h-16 flex items-center justify-between">
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/cart">Cart ({count})</Link>
          {session?.user ? (
            <>
              <Link href="/account">Account</Link>
              <button className="btn btn-ghost" onClick={() => signOut()}>Sign out</button>
            </>
          ) : (
            <button className="btn btn-ghost" onClick={() => signIn()}>Sign in</button>
          )}
        </div>
      </div>
    </header>
  )
}
