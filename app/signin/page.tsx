'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.ok) window.location.href = '/account'
    else setError('Invalid credentials')
  }

  return (
    <main className="container py-12 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded-lg px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="btn btn-primary w-full" type="submit">Sign in</button>
      </form>
      <div className="mt-6 text-sm">
        New here? <Link href="/signup" className="underline">Create an account</Link>
      </div>
      <div className="mt-6">
        <button className="btn w-full" onClick={()=>signIn('google')}>Continue with Google</button>
      </div>
    </main>
  )
}
