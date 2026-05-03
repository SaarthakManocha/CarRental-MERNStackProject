import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion, useInView, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

import Counter from '../components/animations/Counter'
import FlowingMenu from '../components/animations/FlowingMenu'
import Magnet from '../components/animations/Magnet'
import Prism from '../components/animations/Prism'
import ScrollReveal from '../components/animations/ScrollReveal'
import SplitText from '../components/animations/SplitText'
import StarBorder from '../components/animations/StarBorder'
import Stepper, { Step } from '../components/animations/Stepper'
import { FEATURED_BRANDS, HOW_IT_WORKS_STEPS, getBrandMeta } from '../data/brands'

/** Animated number — zero React re-renders, pure MotionValue */
const AnimatedNumber = ({ target, suffix = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const spring = useSpring(0, { stiffness: 18, damping: 25, mass: 1.2 })
  const rounded = useTransform(spring, (v) => `${Math.round(v)}${suffix}`)

  useEffect(() => {
    if (isInView) spring.set(target)
  }, [isInView, spring, target])

  return (
    <motion.span
      ref={ref}
      style={{
        display: 'inline-block',
        minWidth: '2.4ch',
        fontVariantNumeric: 'tabular-nums',
        transform: 'translateZ(0)',
        willChange: 'contents',
      }}
    >
      {rounded}
    </motion.span>
  )
}

/** Stat card with animated number */
const CounterStat = ({ target, suffix = '', label }) => (
  <div className="landing-stat">
    <h3>
      <AnimatedNumber target={target} suffix={suffix} />
    </h3>
    <p>{label}</p>
  </div>
)

const textVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.55, ease: [0.2, 0.9, 0.2, 1] },
  }),
}

/** Convert a hex color to rgba string for the glare hover effect */
const hexToGlare = (hex, opacity = 0.3) => {
  if (!hex) return 'rgba(106, 227, 255, 0.25)'
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const PREVIEW_BRANDS = ['Ferrari', 'Porsche', 'McLaren', 'BMW', 'Aston Martin']
const PREVIEW_CLASSES = ['Supercar', 'Grand Tourer', 'SUV', 'Sedan']

/** Visual mockup card that changes with stepper step */
const StepPreview = ({ step }) => {
  const cards = {
    1: (
      <div className="step-preview-card" key="explore">
        <div className="sp-header">
          <span className="sp-dot active" />
          <span className="sp-title">Browse Fleet</span>
        </div>
        <div className="sp-filter-row">
          {PREVIEW_CLASSES.map((c) => (
            <span key={c} className="sp-chip">{c}</span>
          ))}
        </div>
        <div className="sp-brand-grid">
          {PREVIEW_BRANDS.map((b) => {
            const meta = getBrandMeta(b)
            return (
              <div key={b} className="sp-brand-item" style={{ '--sp-accent': meta.accent }}>
                <strong>{b}</strong>
                <span>{meta.country}</span>
              </div>
            )
          })}
        </div>
      </div>
    ),
    2: (
      <div className="step-preview-card" key="availability">
        <div className="sp-header">
          <span className="sp-dot" style={{ background: 'var(--accent-secondary)' }} />
          <span className="sp-title">Select Dates</span>
        </div>
        <div className="sp-calendar">
          <div className="sp-cal-header">
            <span>April 2026</span>
          </div>
          <div className="sp-cal-grid">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <span key={i} className="sp-cal-day-label">{d}</span>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
              <span
                key={d}
                className={`sp-cal-day${d >= 14 && d <= 17 ? ' selected' : ''}${d === 14 ? ' start' : ''}${d === 17 ? ' end' : ''}`}
              >
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="sp-price-strip">
          <span>3 nights</span>
          <span className="sp-price">₹45,000<small>/day</small></span>
        </div>
      </div>
    ),
    3: (
      <div className="step-preview-card" key="confirmed">
        <div className="sp-header">
          <span className="sp-dot" style={{ background: '#4ade80' }} />
          <span className="sp-title">Booking Confirmed</span>
        </div>
        <div className="sp-confirmation">
          <div className="sp-check-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="sp-conf-label">Reservation Active</p>
        </div>
        <div className="sp-booking-details">
          <div className="sp-detail-row">
            <span className="sp-detail-label">Vehicle</span>
            <span className="sp-detail-value">Ferrari F8 Tributo</span>
          </div>
          <div className="sp-detail-row">
            <span className="sp-detail-label">Pickup</span>
            <span className="sp-detail-value">Apr 14, 2026</span>
          </div>
          <div className="sp-detail-row">
            <span className="sp-detail-label">Return</span>
            <span className="sp-detail-value">Apr 17, 2026</span>
          </div>
          <div className="sp-detail-row">
            <span className="sp-detail-label">Status</span>
            <span className="sp-status-badge">Confirmed</span>
          </div>
        </div>
      </div>
    ),
  }

  return (
    <div className="step-preview-wrap">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {cards[step] || cards[1]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ── Showcase Cars data ── */
const SHOWCASE_CARS = [
  {
    name: 'Ferrari F8 Tributo',
    brand: 'Ferrari',
    cls: 'Supercar',
    image: '/cars/ferrari-f8.png',
    logo: '/cars/ferrari-logo.png',
    accent: '#e8312a',
    specs: [
      { label: 'Engine', value: '3.9L V8 Twin-Turbo' },
      { label: 'Power', value: '710 HP' },
      { label: '0–100 km/h', value: '2.9s' },
    ],
    price: '₹85,000',
  },
  {
    name: 'Lamborghini Huracán',
    brand: 'Lamborghini',
    cls: 'Supercar',
    image: '/cars/lamborghini-huracan.png',
    logo: '/cars/lamborghini-logo.png',
    accent: '#d4a017',
    specs: [
      { label: 'Engine', value: '5.2L V10 NA' },
      { label: 'Power', value: '631 HP' },
      { label: '0–100 km/h', value: '3.2s' },
    ],
    price: '₹78,000',
  },
  {
    name: 'Porsche 911 GT3',
    brand: 'Porsche',
    cls: 'Sports Car',
    image: '/cars/porsche-911.png',
    logo: '/cars/porsche-logo.png',
    accent: '#c8a961',
    specs: [
      { label: 'Engine', value: '4.0L Flat-6 NA' },
      { label: 'Power', value: '502 HP' },
      { label: '0–100 km/h', value: '3.4s' },
    ],
    price: '₹62,000',
  },
  {
    name: 'Mercedes-AMG GT',
    brand: 'Mercedes-Benz',
    cls: 'Grand Tourer',
    image: '/cars/amg-gt.png',
    logo: '/cars/mercedes-logo.png',
    accent: '#a0a0a0',
    specs: [
      { label: 'Engine', value: '4.0L V8 Bi-Turbo' },
      { label: 'Power', value: '577 HP' },
      { label: '0–100 km/h', value: '3.2s' },
    ],
    price: '₹70,000',
  },
]

/** Full-bleed car image card with overlaid specs */
/** Floating car image with overlaid key stats */
const CarShowcaseCard = ({ car }) => (
  <div className="showcase-card">
    <img src={car.image} alt={car.name} className="showcase-card-img" />
    <div className="showcase-card-stats">
      <div className="showcase-stat">
        <span className="showcase-stat-value">{car.specs[1].value}</span>
        <span className="showcase-stat-label">{car.specs[1].label}</span>
      </div>
      <div className="showcase-stat">
        <span className="showcase-stat-value">{car.specs[2].value}</span>
        <span className="showcase-stat-label">{car.specs[2].label}</span>
      </div>
    </div>
  </div>
)

const Landing = () => {
  const reduceMotion = useReducedMotion()
  const heroRef = useRef(null)
  const [prismOpacity, setPrismOpacity] = useState(1)
  const [howStep, setHowStep] = useState(1)
  const [showcaseIdx, setShowcaseIdx] = useState(0)
  const featuredLoop = useMemo(() => [...FEATURED_BRANDS, ...FEATURED_BRANDS], [])

  useEffect(() => {
    if (reduceMotion) return

    const onScroll = () => {
      if (!heroRef.current) return
      const heroH = heroRef.current.offsetHeight
      const scrollY = window.scrollY
      const fade = Math.max(0, 1 - scrollY / (heroH * 0.65))
      setPrismOpacity(fade)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [reduceMotion])

  return (
    <div className="landing-page">
      {/* ── HERO ── Full-viewport, Prism background ── */}
      <section className="landing-hero" ref={heroRef}>
        <div
          className="landing-prism-layer"
          aria-hidden
          style={{ opacity: prismOpacity }}
        >
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
            suspendWhenOffscreen
          />
        </div>

        <div className="landing-hero-content">
          <motion.p
            className="landing-eyebrow"
            initial="hidden"
            animate="visible"
            custom={0.05}
            variants={textVariants}
          >
            Real Racing Inspired Experience
          </motion.p>

          <h1 className="landing-headline">
            <SplitText text="Drive The Wildest" delay={0.12} />
            <br />
            <SplitText text="Machines" delay={0.24} />
          </h1>

          <motion.p
            className="landing-subtext"
            initial="hidden"
            animate="visible"
            custom={0.35}
            variants={textVariants}
          >
            Discover a cinematic showroom of 170 curated vehicles all from
            track-bred monsters to iconic luxury legends.
          </motion.p>

          <motion.div
            className="landing-cta-row"
            initial="hidden"
            animate="visible"
            custom={0.45}
            variants={textVariants}
          >
            <Magnet>
              <Link to="/showroom" className="btn solid pulse">
                Enter Showroom
              </Link>
            </Magnet>
            <Link to="/register" className="btn ghost">
              Create Account
            </Link>
          </motion.div>
        </div>

        <div className="landing-hero-fade" aria-hidden />
      </section>

      {/* ── STATS ── StarBorder animated container ── */}
      <section className="landing-section" style={{ textAlign: 'center' }}>
        <ScrollReveal distance={40} duration={0.5}>
          <p className="landing-section-eyebrow">At A Glance</p>
        </ScrollReveal>
        <ScrollReveal distance={50} duration={0.6} delay={0.1}>
          <h2 className="landing-section-heading">The Numbers That Move Us</h2>
        </ScrollReveal>
        <ScrollReveal distance={60} duration={0.7} delay={0.2}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <StarBorder color="#6ae3ff" speed="6s" thickness={2}>
              <div className="landing-stats-container">
                <CounterStat target={170} suffix="+" label="curated vehicles" />
                <CounterStat target={46} label="global brands" />
                <div className="landing-stat">
                  <h3>24/7</h3>
                  <p>booking ready</p>
                </div>
                <div className="landing-stat">
                  <h3>INR</h3>
                  <p>transparent pricing</p>
                </div>
              </div>
            </StarBorder>
          </div>
        </ScrollReveal>
      </section>

      {/* ── HOW IT WORKS ── Interactive Stepper + Preview ── */}
      <section className="landing-section landing-how-section">
        <ScrollReveal distance={35} duration={0.5}>
          <p className="landing-section-eyebrow">How It Works</p>
        </ScrollReveal>
        <ScrollReveal distance={45} duration={0.55} delay={0.1}>
          <h2 className="landing-section-heading">Three Steps To The Drive</h2>
        </ScrollReveal>
        <ScrollReveal distance={50} duration={0.6} delay={0.2}>
          <div className="landing-how-layout">
            <div className="landing-how-left">
              <Stepper
                initialStep={1}
                backButtonText="Previous"
                nextButtonText="Next Step"
                onStepChange={setHowStep}
              >
                {HOW_IT_WORKS_STEPS.map((step, index) => (
                  <Step key={step.title}>
                    <h4>
                      <span className="landing-step-num">0{index + 1}</span>
                      {step.title}
                    </h4>
                    <p>{step.description}</p>
                  </Step>
                ))}
              </Stepper>
            </div>
            <div className="landing-how-right">
              <StepPreview step={howStep} />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FEATURED BRANDS ── Scrolling marquee ── */}
      <section className="landing-section">
        <ScrollReveal distance={40} duration={0.5}>
          <p className="landing-section-eyebrow">Featured Brands</p>
        </ScrollReveal>
        <ScrollReveal distance={50} duration={0.6} delay={0.1}>
          <h2 className="landing-section-heading">Curated Manufacturer Fleet</h2>
        </ScrollReveal>
        <ScrollReveal distance={30} duration={0.6} delay={0.2}>
          <div className="landing-marquee-wrap">
            <div className="landing-marquee-track">
              {featuredLoop.map((brand, index) => {
                const meta = getBrandMeta(brand)
                return (
                  <Link
                    to={`/fleet/${encodeURIComponent(brand)}`}
                    className="landing-brand-pill glare-hover"
                    key={`${brand}-${index}`}
                    style={{
                      '--brand-accent': meta.accent,
                      '--glare-color': hexToGlare(meta.accent, 0.5),
                    }}
                  >
                    <strong>{brand}</strong>
                    <span>{meta.country}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── SHOWCASE ── FlowingMenu + detail card ── */}
      <section className="landing-section">
        <ScrollReveal distance={40} duration={0.5}>
          <p className="landing-section-eyebrow">Handpicked</p>
        </ScrollReveal>
        <ScrollReveal distance={50} duration={0.6} delay={0.1}>
          <h2 className="landing-section-heading">Peek At Our Finest</h2>
        </ScrollReveal>
        <ScrollReveal distance={30} duration={0.6} delay={0.2}>
          <div className="showcase-layout">
            <div className="showcase-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={showcaseIdx}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <CarShowcaseCard car={SHOWCASE_CARS[showcaseIdx]} />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="showcase-right">
              <FlowingMenu
                items={SHOWCASE_CARS.map((c) => ({
                  link: `/fleet/${encodeURIComponent(c.brand)}`,
                  text: c.name,
                  image: c.logo,
                }))}
                speed={20}
                textColor="var(--text-primary)"
                bgColor="rgba(5, 7, 15, 0.9)"
                marqueeBgColor="var(--accent-primary)"
                marqueeTextColor="#04131b"
                borderColor="rgba(106, 227, 255, 0.12)"
                onItemHover={setShowcaseIdx}
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="landing-section landing-final-cta">
        <ScrollReveal distance={40} duration={0.5} scale={0.96}>
          <p className="landing-section-eyebrow">Ready?</p>
          <h2 className="landing-section-heading">
            Your Next Machine Awaits
          </h2>
          <div className="landing-cta-row" style={{ justifyContent: 'center', marginTop: 24 }}>
            <Magnet>
              <Link to="/showroom" className="btn solid pulse">
                Browse Showroom
              </Link>
            </Magnet>
            <Link to="/register" className="btn ghost">
              Sign Up Free
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}

export default Landing
