const BRAND_METADATA = {
  acura: { country: 'Japan', tagline: 'Precision Engineering', accent: '#7bd3ff' },
  'alfa romeo': { country: 'Italy', tagline: 'Italian Racing Soul', accent: '#d94e55' },
  astonmartin: { country: 'United Kingdom', tagline: 'Grand Touring Heritage', accent: '#5ec9b1' },
  audi: { country: 'Germany', tagline: 'Quattro Performance', accent: '#8aa7ff' },
  bentley: { country: 'United Kingdom', tagline: 'Handcrafted Power', accent: '#d7b074' },
  bmw: { country: 'Germany', tagline: 'Driver Focused Dynamics', accent: '#72a8ff' },
  bugatti: { country: 'France', tagline: 'Hypercar Royalty', accent: '#4d9dff' },
  cadillac: { country: 'United States', tagline: 'American Prestige', accent: '#c7cddc' },
  chevrolet: { country: 'United States', tagline: 'Muscle And Motorsport', accent: '#f0be58' },
  dodge: { country: 'United States', tagline: 'Raw American Muscle', accent: '#ef6d5c' },
  ferrari: { country: 'Italy', tagline: 'Prancing Horse Legacy', accent: '#ff4e4e' },
  ford: { country: 'United States', tagline: 'Track To Street Icons', accent: '#68a2ff' },
  honda: { country: 'Japan', tagline: 'Reliable Performance', accent: '#e86f6f' },
  hyundai: { country: 'South Korea', tagline: 'Modern Performance Lab', accent: '#7ea0d2' },
  infiniti: { country: 'Japan', tagline: 'Luxury Precision', accent: '#bba9ff' },
  jaguar: { country: 'United Kingdom', tagline: 'Elegant Speed', accent: '#53d4be' },
  koenigsegg: { country: 'Sweden', tagline: 'Engineering Extremes', accent: '#7ed9ff' },
  lamborghini: { country: 'Italy', tagline: 'Bull Brand Fury', accent: '#ffd158' },
  lexus: { country: 'Japan', tagline: 'Refined Performance', accent: '#8bc6ff' },
  lotus: { country: 'United Kingdom', tagline: 'Lightweight Mastery', accent: '#8fd158' },
  maserati: { country: 'Italy', tagline: 'Trident Grand Tourers', accent: '#7ea7ff' },
  mazda: { country: 'Japan', tagline: 'Crafted Driver Joy', accent: '#89c9ff' },
  mclaren: { country: 'United Kingdom', tagline: 'Formula DNA', accent: '#ff9a57' },
  mercedesbenz: { country: 'Germany', tagline: 'AMG Velocity', accent: '#9fd3d3' },
  mini: { country: 'United Kingdom', tagline: 'Compact Character', accent: '#f0c1a4' },
  mitsubishi: { country: 'Japan', tagline: 'Rally Heritage', accent: '#f27e7e' },
  nissan: { country: 'Japan', tagline: 'Performance Tradition', accent: '#9fb2cc' },
  pagani: { country: 'Italy', tagline: 'Artisan Hypercars', accent: '#d5bc8d' },
  porsche: { country: 'Germany', tagline: 'Motorsport Precision', accent: '#e2bf7b' },
  renault: { country: 'France', tagline: 'French Performance Spirit', accent: '#f2d46f' },
  rimac: { country: 'Croatia', tagline: 'Electric Hyper Future', accent: '#73dcff' },
  subaru: { country: 'Japan', tagline: 'Boxer Balance', accent: '#7da7ff' },
  toyota: { country: 'Japan', tagline: 'Track-Tested Reliability', accent: '#f07b7b' },
  volkswagen: { country: 'Germany', tagline: 'German Everyday Icons', accent: '#78a2d7' },
  volvo: { country: 'Sweden', tagline: 'Safe Scandinavian Power', accent: '#7fa7c9' },
  zenvo: { country: 'Denmark', tagline: 'Nordic Hyper Precision', accent: '#9cb8ff' },
  pontiac: { country: 'United States', tagline: 'Classic Street Legends', accent: '#e89f86' },
  saab: { country: 'Sweden', tagline: 'Aviation Inspired Design', accent: '#8db7d1' },
}

const FALLBACK_META = {
  country: 'Global',
  tagline: 'Performance Collection',
  accent: '#6ae3ff',
}

const normalizeBrandName = (brand = '') => brand.toLowerCase().replace(/[^a-z0-9]/g, '')

export const getBrandMeta = (brand = '') => {
  const key = normalizeBrandName(brand)
  return BRAND_METADATA[key] || FALLBACK_META
}

export const FEATURED_BRANDS = [
  'Ferrari',
  'Lamborghini',
  'Porsche',
  'McLaren',
  'Bugatti',
  'Koenigsegg',
  'Pagani',
  'Aston Martin',
  'Mercedes-Benz',
  'BMW',
]

export const HOW_IT_WORKS_STEPS = [
  {
    title: 'Explore Your Brand',
    description:
      'Open the showroom and browse through 46 global manufacturers ranging from legendary Italian marques like Ferrari and Lamborghini to precision German engineering from Porsche and BMW. Filter by vehicle class, price tier, or performance stats to find the perfect machine for your occasion.',
  },
  {
    title: 'Check Date Availability',
    description:
      'Select your preferred start and end dates using our real-time availability calendar. The system automatically prevents double bookings and overlap conflicts, so you always get a confirmed slot. Pricing is calculated instantly based on your rental duration.',
  },
  {
    title: 'Book And Track',
    description:
      'Confirm your reservation in seconds with a single click. Once booked, manage all your active and past rentals from the bookings dashboard where you can view upcoming pickups, track rental status, and cancel or modify reservations anytime before the start date.',
  },
]

export const SCROLL_FLOAT_LINES = [
  'Twin-Turbo Monsters Sliding Into Midnight Streets',
  'Track-Bred Hypercars Waiting For Your Command',
  'Luxury Cabins Wrapped Around Brutal Acceleration',
  'Every Scroll Unveils Another Dream Machine',
  'Precision Handling Meets Cinematic Presence',
  'From V8 Roar To Electric Hyper Torque',
  'Book Fast. Drive Faster. Repeat.',
  'One Fleet. Infinite Adrenaline.',
]

export const TOTAL_BRAND_METADATA = Object.keys(BRAND_METADATA).length
