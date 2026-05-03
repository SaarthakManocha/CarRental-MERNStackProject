import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'

import { fetchVehiclesByBrand } from '../api/vehicleApi'
import VehicleCard from '../components/cards/VehicleCard'
import SplitText from '../components/animations/SplitText'
import ScrollReveal from '../components/animations/ScrollReveal'
import PageWrapper from '../components/layout/PageWrapper'
import { getBrandMeta } from '../data/brands'

const BrandFleet = () => {
  const { brand } = useParams()
  const decodedBrand = decodeURIComponent(brand || '')

  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [maxPrice, setMaxPrice] = useState('')
  const brandMeta = useMemo(() => getBrandMeta(decodedBrand), [decodedBrand])

  const loadBrandFleet = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetchVehiclesByBrand(decodedBrand)
      setVehicles(response.vehicles || [])
    } catch (loadError) {
      setVehicles([])
      setError('Unable to load this brand fleet. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [decodedBrand])

  useEffect(() => {
    loadBrandFleet()
  }, [loadBrandFleet])

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const typeMatch = typeFilter === 'all' || vehicle.type === typeFilter
      const priceMatch = !maxPrice || vehicle.dailyRate <= Number(maxPrice)
      return typeMatch && priceMatch
    })
  }, [vehicles, typeFilter, maxPrice])

  const availableTypes = useMemo(() => {
    return [...new Set(vehicles.map((vehicle) => vehicle.type))]
  }, [vehicles])

  return (
    <PageWrapper showAccents={false}>
      <section className="bf-header">
        <ScrollReveal distance={30} duration={0.4}>
          <Link to="/showroom" className="bf-back-link">← Back to Showroom</Link>
        </ScrollReveal>

        <ScrollReveal distance={40} duration={0.5} delay={0.05}>
          <p className="eyebrow">{brandMeta.country} — {brandMeta.tagline}</p>
        </ScrollReveal>

        <ScrollReveal distance={50} duration={0.6} delay={0.1}>
          <h1 className="bf-brand-name" style={{ color: brandMeta.accent }}>
            <SplitText text={decodedBrand} />
          </h1>
        </ScrollReveal>

        <ScrollReveal distance={30} duration={0.4} delay={0.15}>
          <p className="bf-count">
            {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} in fleet
          </p>
        </ScrollReveal>

        <ScrollReveal distance={30} duration={0.4} delay={0.2}>
          <div className="bf-filters">
            <label className="bf-filter-label">
              Type
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                <option value="all">All</option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="bf-filter-label">
              Max Price (INR/day)
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="No limit"
              />
            </label>
          </div>
        </ScrollReveal>
      </section>

      {loading ? (
        <div className="route-loader">Loading fleet...</div>
      ) : error ? (
        <div className="empty-state">
          <p>{error}</p>
          <button className="btn ghost" type="button" onClick={loadBrandFleet}>
            Retry
          </button>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="empty-state">No vehicles match the selected filters.</div>
      ) : (
        <section className="bf-grid">
          {filteredVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle._id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
            >
              <VehicleCard vehicle={vehicle} />
            </motion.div>
          ))}
        </section>
      )}
    </PageWrapper>
  )
}

export default BrandFleet
