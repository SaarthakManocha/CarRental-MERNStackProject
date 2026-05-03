import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import { fetchBrands } from '../api/vehicleApi'
import BrandCard from '../components/cards/BrandCard'
import PageWrapper from '../components/layout/PageWrapper'
import { getBrandMeta } from '../data/brands'

const Showroom = () => {
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [brands, setBrands] = useState([])
  const [error, setError] = useState('')

  const loadBrands = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetchBrands()
      setBrands(response.brands || [])
    } catch (loadError) {
      setBrands([])
      setError('Unable to load brands right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadBrands()
  }, [loadBrands])

  const filtered = useMemo(
    () => brands.filter((item) => item.brand.toLowerCase().includes(query.toLowerCase())),
    [brands, query]
  )

  return (
    <PageWrapper showAccents={false}>
      <section className="showroom-head">
        <p className="eyebrow">Brand Gallery</p>
        <h2>Choose Your Legacy</h2>
        <input
          className="search-box"
          placeholder="Search brands"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </section>

      {loading ? (
        <div className="route-loader">Loading showroom...</div>
      ) : error ? (
        <div className="empty-state">
          <p>{error}</p>
          <button className="btn ghost" type="button" onClick={loadBrands}>
            Retry
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No brands match your search.</div>
      ) : (
        <section className="showroom-grid">
          {filtered.map((brand, index) => (
            <motion.div
              key={brand.brand}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35 }}
            >
              <BrandCard brand={brand.brand} count={brand.count} meta={getBrandMeta(brand.brand)} />
            </motion.div>
          ))}
        </section>
      )}
    </PageWrapper>
  )
}

export default Showroom
