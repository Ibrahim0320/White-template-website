export const BRAND = {
  name: 'Monolith Atelier',
  slug: 'monolith',
  hero: {
    type: 'image', // 'image' | 'video'
    src: '/images/hero.jpg', // or '/videos/hero.mp4'
    heading: 'Season 01 / Drop One',
    subheading: 'Architectural silhouettes in monochrome.',
    cta: { label: 'Shop the collection', href: '/shop' },
  },
  theme: {
    primary: '#0a0a0a',
    secondary: '#ffffff',
  },
  chatbot: {
    greeting: "Hi — I'm your stylist. Ask me about fit, fabric, or sizing.",
    systemPrompt:
      "You are a helpful brand stylist for Monolith Atelier. Answer succinctly. If asked about orders, advise to check the /account page.",
  },
}
