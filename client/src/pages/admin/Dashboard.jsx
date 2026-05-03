import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { fetchAllBookings } from '../../api/bookingApi'
import { fetchVehicles } from '../../api/vehicleApi'
import InlineError from '../../components/feedback/InlineError'
import AdminShell from '../../components/layout/AdminShell'
import extractErrorMessage from '../../utils/extractErrorMessage'

const StatCard = ({ value, label, accent, reduceMotion }) => (
  <motion.article
    className="admin-stat-card"
    whileHover={reduceMotion ? undefined : { y: -6, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  >
    <div className="admin-stat-accent" style={{ background: accent }} />
    <h3 className="admin-stat-value">{value}</h3>
    <p className="admin-stat-label">{label}</p>
  </motion.article>
)

const Dashboard = () => {
  const [stats, setStats] = useState({ vehicles: 0, bookings: 0, activeBookings: 0, completedBookings: 0, cancelledBookings: 0, revenue: 0 })
  const [errorMessage, setErrorMessage] = useState('')
  const reduceMotion = useReducedMotion()

  const loadDashboard = async () => {
    setErrorMessage('')
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([fetchVehicles(), fetchAllBookings()])
      const allBookings = bookingsRes.bookings || []
      const active = allBookings.filter((b) => b.status === 'active')
      const completed = allBookings.filter((b) => b.status === 'completed')
      const cancelled = allBookings.filter((b) => b.status === 'cancelled')
      const revenue = allBookings
        .filter((b) => b.status !== 'cancelled')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

      setStats({
        vehicles: vehiclesRes.count || 0,
        bookings: allBookings.length,
        activeBookings: active.length,
        completedBookings: completed.length,
        cancelledBookings: cancelled.length,
        revenue,
      })
    } catch (error) {
      setStats({ vehicles: 0, bookings: 0, activeBookings: 0, completedBookings: 0, cancelledBookings: 0, revenue: 0 })
      setErrorMessage(extractErrorMessage(error, 'Failed to load dashboard statistics'))
    }
  }

  useEffect(() => { loadDashboard() }, [])

  return (
    <AdminShell eyebrow="Admin Command Center" title="Fleet Dashboard">
      <InlineError message={errorMessage} onRetry={loadDashboard} />

      <section className="admin-stats-grid">
        <StatCard value={stats.vehicles} label="Fleet Size" accent="#6ae3ff" reduceMotion={reduceMotion} />
        <StatCard value={stats.bookings} label="Total Bookings" accent="#a78bfa" reduceMotion={reduceMotion} />
        <StatCard value={stats.activeBookings} label="Active Now" accent="#34d399" reduceMotion={reduceMotion} />
        <StatCard value={stats.completedBookings} label="Completed" accent="#60a5fa" reduceMotion={reduceMotion} />
        <StatCard value={stats.cancelledBookings} label="Cancelled" accent="#f87171" reduceMotion={reduceMotion} />
        <StatCard value={`₹${stats.revenue.toLocaleString('en-IN')}`} label="Total Revenue" accent="#fbbf24" reduceMotion={reduceMotion} />
      </section>

      <section className="admin-quick-actions">
        <h3>Quick Actions</h3>
        <div className="admin-action-grid">
          <Link className="admin-action-card" to="/admin/vehicles">
            <div>
              <strong>Manage Fleet</strong>
              <p>View, edit, or remove vehicles</p>
            </div>
          </Link>
          <Link className="admin-action-card" to="/admin/vehicles/add">
            <div>
              <strong>Add Vehicle</strong>
              <p>Add a new car to the fleet</p>
            </div>
          </Link>
          <Link className="admin-action-card" to="/admin/bookings">
            <div>
              <strong>Booking Schedule</strong>
              <p>Manage all customer reservations</p>
            </div>
          </Link>
        </div>
      </section>
    </AdminShell>
  )
}

export default Dashboard
