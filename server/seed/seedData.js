import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { connectDB } from '../config/db.js'
import User from '../models/User.js'
import Vehicle from '../models/Vehicle.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const csvPath = path.resolve(__dirname, '../../data/seed_cars_road_drivable_uncapped_corebrands_170.csv')

const getBrandTier = (brand = '') => {
  const brandLower = brand.toLowerCase()

  // Define brand tiers
  const hypercarBrands = ['bugatti', 'koenigsegg', 'pagani', 'rimac', 'hennessey']
  const supercarBrands = ['ferrari', 'lamborghini', 'mclaren', 'aston martin', 'porsche']
  const premiumBrands = [
    'mercedes-benz',
    'mercedes-amg',
    'bentley',
    'maserati',
    'cadillac',
    'lexus',
    'jaguar',
    'lotus',
    'audi',
  ]
  const sportsBrands = ['bmw', 'nissan', 'chevrolet', 'dodge', 'ford', 'srt', 'ariel', 'caterham', 'ktm', 'radical']
  const economyBrands = ['honda', 'mazda', 'volkswagen', 'subaru', 'mitsubishi', 'hyundai', 'renault']

  if (hypercarBrands.some((b) => brandLower.includes(b))) {
    return 'hypercar'
  }

  if (supercarBrands.some((b) => brandLower.includes(b))) {
    return 'supercar'
  }

  if (premiumBrands.some((b) => brandLower.includes(b))) {
    return 'premium'
  }

  if (sportsBrands.some((b) => brandLower.includes(b))) {
    return 'sports'
  }

  if (economyBrands.some((b) => brandLower.includes(b))) {
    return 'economy'
  }

  // Unknown brands default to premium-ish.
  return 'premium'
}

const getTierPrice = (brand, pr) => {
  const tier = getBrandTier(brand)

  let baseMin
  let baseMax

  if (tier === 'hypercar') {
    baseMin = 150000
    baseMax = 500000
  } else if (tier === 'supercar') {
    baseMin = 50000
    baseMax = 150000
  } else if (tier === 'premium') {
    baseMin = 20000
    baseMax = 50000
  } else if (tier === 'sports') {
    baseMin = 8000
    baseMax = 20000
  } else if (tier === 'economy') {
    baseMin = 3000
    baseMax = 8000
  } else {
    baseMin = 15000
    baseMax = 40000
  }

  // Use PR (0-130 scale) to interpolate within the tier range
  // Higher PR = more exclusive = higher price
  const prNormalized = Math.min(Math.max((pr || 30) / 100, 0), 1)
  const price = baseMin + (baseMax - baseMin) * prNormalized

  // Round to nearest 500 for clean pricing
  return Math.round(price / 500) * 500
}

const generateDescription = (brand, model, stats, tier) => {
  const { topSpeed, acceleration, braking, grip } = stats
  const fullName = `${brand} ${model}`

  const templates = {
    hypercar: [
      `The ${fullName} redefines the boundaries of automotive engineering. With a mind-bending top speed of ${topSpeed} km/h and 0-100 km/h in just ${acceleration} seconds, this is not merely a car -- it's a statement of absolute power and exclusivity.`,
      `Born from relentless pursuit of perfection, the ${fullName} delivers ${topSpeed} km/h of pure adrenaline. Its ${braking}m braking distance and ${grip}G cornering grip ensure you're always in command of its extraordinary capabilities.`,
    ],
    supercar: [
      `The ${fullName} embodies the perfect fusion of Italian craftsmanship and raw performance. Hitting ${topSpeed} km/h with ${acceleration}s to 100, it transforms every drive into an unforgettable experience.`,
      `Sculpted by aerodynamics and driven by passion, the ${fullName} delivers ${topSpeed} km/h top speed with surgical precision. Every curve, every line serves a purpose -- pure performance artistry.`,
    ],
    premium: [
      `The ${fullName} blends sophisticated luxury with thrilling performance. Capable of ${topSpeed} km/h and reaching 100 km/h in ${acceleration} seconds, it offers an elevated driving experience for those who demand more.`,
      `Refined yet powerful, the ${fullName} strikes the perfect balance between comfort and capability. With ${topSpeed} km/h on tap and ${grip}G of lateral grip, it rewards spirited driving.`,
    ],
    sports: [
      `The ${fullName} is the enthusiast's weapon of choice. With ${topSpeed} km/h top speed, ${acceleration}s 0-100 sprint, and razor-sharp ${grip}G grip, it delivers pure driving joy without compromise.`,
      `Raw, focused, and exhilarating -- the ${fullName} puts driver engagement first. Its ${topSpeed} km/h capability and ${braking}m braking distance make it a formidable machine on any road.`,
    ],
    economy: [
      `The ${fullName} proves that performance doesn't require a luxury badge. With ${topSpeed} km/h and a ${acceleration}s 0-100 time, it punches well above its weight class -- a true pocket rocket.`,
      `Don't let the nameplate fool you -- the ${fullName} is a genuine performance machine. ${topSpeed} km/h, ${acceleration}s to 100, and ${grip}G grip make it an accessible thrill ride.`,
    ],
  }

  const tierTemplates = templates[tier] || templates.sports
  // Pick a template based on a simple hash of the model name for variety.
  const index = fullName.length % tierTemplates.length
  return tierTemplates[index]
}

const inferType = (modelName = '', brandName = '') => {
  const lower = modelName.toLowerCase()
  const brand = brandName.toLowerCase().trim()

  const hypercarBrands = new Set(['bugatti', 'koenigsegg', 'pagani', 'rimac', 'hennessey', 'apollo'])
  const supercarBrands = new Set(['ferrari', 'lamborghini', 'mclaren', 'aston martin'])
  const mainstreamSportsBrands = new Set([
    'honda',
    'mazda',
    'bmw',
    'nissan',
    'subaru',
    'mitsubishi',
    'mitsubishi motors',
    'hyundai',
    'renault',
    'volkswagen',
  ])

  if (hypercarBrands.has(brand)) {
    return 'hypercar'
  }

  if (supercarBrands.has(brand)) {
    return 'supercar'
  }

  if (mainstreamSportsBrands.has(brand)) {
    return 'sports'
  }

  if (lower.includes('gt') || lower.includes('rs') || lower.includes('type-r') || lower.includes('gtr')) {
    return 'sports'
  }

  if (lower.includes('suv') || lower.includes('x5') || lower.includes('cullinan')) {
    return 'suv'
  }

  const luxuryBrands = new Set([
    'bentley',
    'maserati',
    'mercedes-benz',
    'mercedes-amg',
    'cadillac',
    'lexus',
    'rolls-royce',
  ])

  if (luxuryBrands.has(brand) || brand.includes('mercedes')) {
    return 'luxury'
  }

  return 'sports'
}

const inferSeats = (type) => (type === 'suv' ? 5 : 2)

const inferFuelType = (modelName = '') => {
  const lower = modelName.toLowerCase()
  if (lower.includes('e-tron') || lower.includes('taycan') || lower.includes('ev') || lower.includes('nevera')) {
    return 'electric'
  }
  if (lower.includes('hybrid')) return 'hybrid'
  return 'petrol'
}

const parseCsv = (rawCsv) => {
  const [headerLine, ...lines] = rawCsv.split(/\r?\n/).filter(Boolean)
  const headers = headerLine.split(',').map((item) => item.replace(/^"|"$/g, ''))

  return lines.map((line) => {
    const values = line
      .match(/("[^"]*"|[^,]+)/g)
      .map((item) => item.replace(/^"|"$/g, ''))

    return headers.reduce((acc, header, idx) => {
      acc[header] = values[idx] ?? ''
      return acc
    }, {})
  })
}

const buildVehicles = (rows) =>
  rows.map((row) => {
    const type = inferType(row.Model, row.Manufacturer)
    const topSpeed = Number(row['Top Speed']) || 0
    const acceleration = Number(row.Acceleration) || 0
    const braking = Number(row.Braking) || 0
    const grip = Number(row.Grip) || 0
    const rr3Pr = Number(row.PR) || 0
    const tier = getBrandTier(row.Manufacturer)

    return {
      name: `${row.Manufacturer} ${row.Model}`,
      type,
      brand: row.Manufacturer,
      model: row.Model,
      year: 2024,
      dailyRate: getTierPrice(row.Manufacturer, rr3Pr || 30),
      seats: inferSeats(type),
      transmission: 'automatic',
      fuelType: inferFuelType(row.Model),
      description: generateDescription(row.Manufacturer, row.Model, { topSpeed, acceleration, braking, grip }, tier),
      isAvailable: true,
      stats: {
        topSpeed,
        acceleration,
        braking,
        grip,
        rr3Class: row.Class || '',
        rr3Type: row.Type || '',
        rr3Pr,
      },
    }
  })

const seed = async () => {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error('Please set MONGO_URI and JWT_SECRET in root .env before seeding')
  }

  await connectDB(process.env.MONGO_URI)

  const csvRaw = fs.readFileSync(csvPath, 'utf-8')
  const rows = parseCsv(csvRaw)
  const vehicles = buildVehicles(rows)

  await User.deleteMany({})
  await Vehicle.deleteMany({})

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@carrental.dev',
    password: 'Admin@123',
    role: 'admin',
  })

  const insertedVehicles = await Vehicle.insertMany(vehicles)

  console.log(`Seed complete. Admin: ${admin.email}`)
  console.log(`Inserted vehicles: ${insertedVehicles.length}`)

  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
