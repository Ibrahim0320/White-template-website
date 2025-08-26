'use client'
import { useState, useRef } from 'react'
import { BRAND } from '@/brand.config'

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; content: string }[]>([
    { role: 'assistant', content: BRAND.chatbot.greeting }
  ])
  const inputRef = useRef<HTMLInputElement>(null)

  async function send() {
    const content = inputRef.current?.value?.trim()
    if (!content) return
    setMessages(m => [...m, { role: 'user', content }])
    inputRef.current!.value = ''
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content }] }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'assistant', content: data.reply }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'Sorry, I had an issue responding.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6">
      {open ? (
        <div className="w-80 h-96 bg-white border shadow-xl rounded-2xl flex flex-col overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="font-medium">Stylist</div>
            <button className="text-sm" onClick={() => setOpen(false)}>×</button>
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-auto">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div className={'inline-block px-3 py-2 rounded-2xl ' + (m.role === 'user' ? 'bg-black text-white' : 'bg-gray-100')}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-gray-500">Thinking…</div>}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input ref={inputRef} placeholder="Ask about sizing…" className="flex-1 border rounded-full px-3 py-2 text-sm" onKeyDown={(e) => { if (e.key==='Enter') send() }} />
            <button className="btn btn-primary" onClick={send}>Send</button>
          </div>
        </div>
      ) : (
        <button className="btn btn-primary rounded-full" onClick={() => setOpen(true)}>Chat</button>
      )}
    </div>
  )
}
