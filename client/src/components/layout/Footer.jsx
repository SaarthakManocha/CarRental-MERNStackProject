import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const Footer = () => {
  const year = new Date().getFullYear()
  const { isAuthenticated, user } = useAuth()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* ── Brand ── */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="brand-dot" />
            <span>Luxury Motors</span>
          </Link>
          <p className="footer-tagline">
            Premium car rentals from the world's most prestigious manufacturers.
            Your next drive is just a click away.
          </p>
        </div>

        {/* ── Quick Links ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Quick Links</h4>
          <nav className="footer-nav" aria-label="Footer navigation">
            <Link to="/">Home</Link>
            <Link to="/showroom">Browse Fleet</Link>
            {isAuthenticated ? (
              <Link to="/my-bookings">My Bookings</Link>
            ) : (
              <>
                <Link to="/login">Sign In</Link>
                <Link to="/register">Create Account</Link>
              </>
            )}
          </nav>
        </div>

        {/* ── Popular Brands ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Top Brands</h4>
          <nav className="footer-nav" aria-label="Footer brand links">
            <Link to="/fleet/Ferrari">Ferrari</Link>
            <Link to="/fleet/Lamborghini">Lamborghini</Link>
            <Link to="/fleet/Porsche">Porsche</Link>
            <Link to="/fleet/Mercedes-Benz">Mercedes-Benz</Link>
            <Link to="/fleet/BMW">BMW</Link>
            <Link to="/fleet/McLaren">McLaren</Link>
          </nav>
        </div>

        {/* ── Legal / Info ── */}
        <div className="footer-col">
          <h4 className="footer-col-title">Information</h4>
          <nav className="footer-nav" aria-label="Footer info links">
            <span className="footer-info-link">About Us</span>
            <span className="footer-info-link">Privacy Policy</span>
            <span className="footer-info-link">Terms of Service</span>
            <span className="footer-info-link">Contact</span>
          </nav>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        <p>© {year} Luxury Motors. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
