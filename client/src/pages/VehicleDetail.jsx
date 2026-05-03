import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { createBooking } from '../api/bookingApi'
import { checkVehicleAvailability, fetchVehicleById } from '../api/vehicleApi'
import LightRays from '../components/animations/LightRays'
import Magnet from '../components/animations/Magnet'
import InlineError from '../components/feedback/InlineError'
import SplitText from '../components/animations/SplitText'
import ScrollReveal from '../components/animations/ScrollReveal'
import PageWrapper from '../components/layout/PageWrapper'
import { getBrandMeta } from '../data/brands'
import useVehicleImage from '../hooks/useVehicleImage'
import { useAuth } from '../hooks/useAuth'
import extractErrorMessage from '../utils/extractErrorMessage'

gsap.registerPlugin(ScrollTrigger)

const VehicleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const carRef = useRef(null)
  const heroRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [vehicle, setVehicle] = useState(null)
  const [checking, setChecking] = useState(false)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [availability, setAvailability] = useState(null)
  const [dates, setDates] = useState({ startDate: '', endDate: '' })
  const [errorMessage, setErrorMessage] = useState('')

  // Today's date string for min attr on date inputs (YYYY-MM-DD)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  const loadVehicle = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const response = await fetchVehicleById(id)
      setVehicle(response.vehicle)
    } catch (error) {
      setVehicle(null)
      setErrorMessage(extractErrorMessage(error, 'Unable to load vehicle details'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadVehicle()
  }, [loadVehicle])

  const nights = useMemo(() => {
    if (!dates.startDate || !dates.endDate) return 0
    const start = new Date(dates.startDate)
    const end = new Date(dates.endDate)
    if (start > end) return 0
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
  }, [dates])

  const totalEstimate = useMemo(() => {
    if (!vehicle || !nights) return 0
    return nights * vehicle.dailyRate
  }, [vehicle, nights])

  const brandMeta = useMemo(() => getBrandMeta(vehicle?.brand || ''), [vehicle?.brand])
  const { hasImage, imageSrc, handleImageError } = useVehicleImage(vehicle)

  /* ── Car entrance + scroll-exit animation ── */
  useEffect(() => {
    const car = carRef.current
    const hero = heroRef.current
    if (!car || !hero || !vehicle) return

    let st = null

    // Entrance: drive in from far right
    gsap.set(car, { x: 800, opacity: 0 })
    gsap.to(car, {
      x: 0,
      opacity: 1,
      duration: 1.8,
      delay: 0.4,
      ease: 'power3.out',
      onComplete: () => {
        // Only set up scroll-exit AFTER entrance finishes
        st = ScrollTrigger.create({
          trigger: hero,
          start: 'center top',
          end: 'bottom top',
          scrub: 0.6,
          animation: gsap.fromTo(car,
            { x: 0, opacity: 1 },
            { x: -500, opacity: 0, ease: 'none' },
          ),
        })
      },
    })

    return () => {
      if (st) st.kill()
      gsap.killTweensOf(car)
    }
  }, [vehicle])

  const handleDateChange = (event) => {
    const { name, value } = event.target
    if (errorMessage) setErrorMessage('')
    setDates((previous) => ({ ...previous, [name]: value }))
    setAvailability(null)
  }

  const handleCheck = async () => {
    if (!dates.startDate || !dates.endDate) {
      toast.error('Select both start and end dates')
      return
    }

    setChecking(true)
    setErrorMessage('')

    try {
      const response = await checkVehicleAvailability(id, dates)
      setAvailability(response)
      if (response.available) {
        toast.success('Vehicle is available for selected dates')
      } else {
        toast.error(response.reason || 'Vehicle not available')
      }
    } catch (error) {
      const message = extractErrorMessage(error, 'Availability check failed')
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setChecking(false)
    }
  }

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error('Please login before booking')
      navigate('/login', { state: { from: `/vehicle/${id}` } })
      return
    }

    if (!dates.startDate || !dates.endDate) {
      toast.error('Select booking dates first')
      return
    }

    setBookingLoading(true)
    setErrorMessage('')

    try {
      await createBooking({ vehicleId: id, ...dates })
      toast.success('Booking confirmed')
      navigate('/my-bookings')
    } catch (error) {
      const message = extractErrorMessage(error, 'Booking failed')
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <PageWrapper showAccents={false}>
        <div className="route-loader">Loading vehicle details...</div>
      </PageWrapper>
    )
  }

  if (!vehicle) {
    return (
      <PageWrapper showAccents={false}>
        <div className="empty-state">
          <p>{errorMessage || 'Vehicle not found.'}</p>
          <button type="button" className="btn ghost" onClick={loadVehicle}>
            Retry
          </button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper showAccents={false}>
      {/* ── HERO — Car + Light Rays ── */}
      <section className="vd-hero" ref={heroRef}>
        <div className="vd-rays-layer">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.6}
            lightSpread={1.8}
            rayLength={3.0}
            pulsating
            fadeDistance={1.4}
            saturation={0.6}
            followMouse={false}
            mouseInfluence={0}
          />
        </div>

        <div className="vd-car-wrap" ref={carRef}>
          {hasImage && (
            <img
              className="vd-car-img"
              src={imageSrc}
              alt={`${vehicle.brand} ${vehicle.model}`}
              onError={handleImageError}
            />
          )}
          {!hasImage && (
            <div className="vd-car-placeholder">
              <span>{vehicle.brand}</span>
            </div>
          )}
        </div>

        <div className="vd-scroll-hint">
          <span>Scroll for details</span>
          <div className="vd-scroll-chevron" />
        </div>
      </section>

      {/* ── DETAILS — scroll float-up ── */}
      <section className="vd-details">
        <ScrollReveal distance={40} duration={0.5}>
          <p className="eyebrow">{vehicle.brand}</p>
        </ScrollReveal>

        <ScrollReveal distance={50} duration={0.6} delay={0.1}>
          <h1 className="vd-model-name">
            <SplitText text={vehicle.model} />
          </h1>
        </ScrollReveal>

        <ScrollReveal distance={40} duration={0.5} delay={0.15}>
          <p className="vd-description">{vehicle.description}</p>
        </ScrollReveal>

        <ScrollReveal distance={40} duration={0.5} delay={0.2}>
          <div className="vd-specs-row">
            <div className="vd-spec">
              <span className="vd-spec-value">{vehicle.stats?.topSpeed || 0}</span>
              <span className="vd-spec-unit">km/h</span>
              <span className="vd-spec-label">Top Speed</span>
            </div>
            <div className="vd-spec">
              <span className="vd-spec-value">{vehicle.stats?.acceleration || 0}</span>
              <span className="vd-spec-unit">sec</span>
              <span className="vd-spec-label">0–100 km/h</span>
            </div>
            <div className="vd-spec">
              <span className="vd-spec-value">{vehicle.stats?.grip || 0}</span>
              <span className="vd-spec-unit">G</span>
              <span className="vd-spec-label">Grip</span>
            </div>
            <div className="vd-spec">
              <span className="vd-spec-value">{vehicle.stats?.braking || 0}</span>
              <span className="vd-spec-unit">m</span>
              <span className="vd-spec-label">Braking</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal distance={30} duration={0.5} delay={0.25}>
          <div className="vd-chips">
            <span className="vd-chip">{vehicle.type}</span>
            <span className="vd-chip">{vehicle.seats} Seats</span>
            <span className="vd-chip">{vehicle.fuelType}</span>
            <span className="vd-chip">{vehicle.transmission}</span>
          </div>
        </ScrollReveal>

        <ScrollReveal distance={30} duration={0.4} delay={0.3}>
          <Link to={`/fleet/${encodeURIComponent(vehicle.brand)}`} className="btn ghost vd-back-link">
            ← Back to {vehicle.brand} Fleet
          </Link>
        </ScrollReveal>
      </section>

      {/* ── BOOKING — scroll float-up glass card ── */}
      <section className="vd-booking-section">
        <ScrollReveal distance={50} duration={0.6}>
          <div className="vd-booking-card">
            <div className="vd-booking-header">
              <h3>Book This Vehicle</h3>
              <p className="vd-price">INR {vehicle.dailyRate}<small>/day</small></p>
            </div>

            <InlineError message={errorMessage} />

            <div className="vd-booking-dates">
              <label>
                Start Date
                <input type="date" name="startDate" value={dates.startDate} min={todayStr} onChange={handleDateChange} />
              </label>
              <label>
                End Date
                <input type="date" name="endDate" value={dates.endDate} min={dates.startDate || todayStr} onChange={handleDateChange} />
              </label>
            </div>

            {(nights > 0 || availability) && (
              <div className="vd-booking-summary">
                {nights > 0 && <span>Total days: {nights}</span>}
                {nights > 0 && <span>Estimated total: INR {totalEstimate.toLocaleString()}</span>}
                {availability && (
                  <span className={availability.available ? 'vd-available' : 'vd-unavailable'}>
                    {availability.available ? '✓ Available' : '✗ Unavailable'}
                  </span>
                )}
              </div>
            )}

            <div className="vd-booking-actions">
              <button className="btn ghost" onClick={handleCheck} disabled={checking}>
                {checking ? 'Checking...' : 'Check Availability'}
              </button>
              <Magnet>
                <button
                  className="btn solid"
                  onClick={handleBook}
                  disabled={bookingLoading || !availability?.available}
                >
                  {bookingLoading ? 'Booking...' : 'Book Now'}
                </button>
              </Magnet>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </PageWrapper>
  )
}

export default VehicleDetail
