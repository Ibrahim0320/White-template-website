'use client'
import { create } from 'zustand'

export type CartItem = {
  productId: string
  title: string
  priceCents: number
  image?: string
  quantity: number
}

type CartState = {
  items: CartItem[]
  add: (item: Omit<CartItem,'quantity'>, qty?: number) => void
  remove: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clear: () => void
}

const storageKey = 'fashionai-cart'

function load(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) as CartItem[] : []
  } catch { return [] }
}

function save(items: CartItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey, JSON.stringify(items))
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (item, qty = 1) => {
    const items = get().items.length ? get().items : load()
    const i = items.findIndex(x => x.productId === item.productId)
    if (i >= 0) items[i].quantity += qty
    else items.push({ ...item, quantity: qty })
    save(items)
    set({ items })
  },
  remove: (productId) => {
    const items = (get().items.length ? get().items : load()).filter(x => x.productId !== productId)
    save(items)
    set({ items })
  },
  setQty: (productId, qty) => {
    const items = get().items.length ? get().items : load()
    const i = items.findIndex(x => x.productId === productId)
    if (i >= 0) items[i].quantity = qty
    save(items)
    set({ items })
  },
  clear: () => { save([]); set({ items: [] }) }
}))
