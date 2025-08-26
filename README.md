# Fashion AI Store (Monobrand)

Luxury-inspired monobrand storefront with Next.js 14, Prisma/Postgres, Stripe Checkout, NextAuth, and an OpenAI-powered stylist chatbot.

## Features
- Home hero (video or image), shop grid, product pages
- Local cart + Stripe Checkout
- Accounts with NextAuth (Google + Credentials)
- Order history
- About page from DB
- Chatbot with brand-configurable persona

## Quickstart

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Create `.env.local` from `.env.example`.

Set `STRIPE_WEBHOOK_SECRET` after creating a webhook:
```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Deploy to Vercel and set all env vars.
