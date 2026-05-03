/**
 * Slugify a string for use in image filenames.
 * Uses NFD decomposition to strip accents, handles German ß,
 * and preserves dots for version numbers (16.4, 3.5, R.S.).
 */
const slugifySegment = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const getVehicleImageBasename = (vehicle) => {
  if (!vehicle) {
    return ''
  }

  const brandSlug = slugifySegment(vehicle.brand)
  const modelSlug = slugifySegment(vehicle.model)

  return [brandSlug, modelSlug].filter(Boolean).join('-')
}

export const getVehicleImageCandidates = (vehicle) => {
  const basename = getVehicleImageBasename(vehicle)

  if (!basename) {
    return []
  }

  return ['webp', 'jpg', 'jpeg', 'png'].map((extension) => `/vehicle-images/${basename}.${extension}`)
}