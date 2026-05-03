import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'

const navLinkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const isVehicleDetail = location.pathname.startsWith('/vehicle/')
  const isImmersive = isLanding || isVehicleDetail
  const [isAtTop, setIsAtTop] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsAtTop(window.scrollY <= 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const navClass = [
    'main-nav',
    isImmersive ? 'nav-landing' : '',
    isAtTop ? 'at-top' : 'scrolled',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.header
      className={navClass}
      initial={reduceMotion ? { y: 0, opacity: 1 } : { y: -36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <Link to="/" className="brand-mark">
        <span className="brand-dot" />
        <span className="brand-name">Luxury Motors</span>
      </Link>

      <button
        className={`nav-hamburger ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      <nav className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
        <NavLink to="/" className={navLinkClass} end>
          Home
        </NavLink>
        <NavLink to="/showroom" className={navLinkClass}>
          Fleet
        </NavLink>
        {isAuthenticated && user?.role !== 'admin' && (
          <NavLink to="/my-bookings" className={navLinkClass}>
            Bookings
          </NavLink>
        )}
        {user?.role === 'admin' && (
          <>
            <span className="nav-divider" />
            <NavLink to="/admin/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/vehicles" className={navLinkClass}>
              Manage
            </NavLink>
            <NavLink to="/admin/bookings" className={navLinkClass}>
              Schedule
            </NavLink>
          </>
        )}
      </nav>

      <div className={`nav-actions ${mobileOpen ? 'mobile-open' : ''}`}>
        {isAuthenticated ? (
          <>
            <span className="nav-greeting">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <span className="role-pill">{user?.role}</span>
            <button className="btn ghost btn-sm" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn ghost btn-sm">
              Login
            </NavLink>
            <NavLink to="/register" className="btn solid btn-sm">
              Register
            </NavLink>
          </>
        )}
      </div>
    </motion.header>
  )
}

export default Navbar
