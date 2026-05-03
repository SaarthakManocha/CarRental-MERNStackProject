import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { fetchAllBookings, updateBookingStatus } from '../../api/bookingApi'
import BookingTimeline from '../../components/admin/BookingTimeline'
import InlineError from '../../components/feedback/InlineError'
import AdminShell from '../../components/layout/AdminShell'
import extractErrorMessage from '../../utils/extractErrorMessage'

const STATUS_CONFIG = {
  active: { bg: 'rgba(52,211,153,0.14)', color: '#34d399' },
  completed: { bg: 'rgba(96,165,250,0.14)', color: '#60a5fa' },
  cancelled: { bg: 'rgba(248,113,113,0.14)', color: '#f87171' },
}

const BookingSchedule = () => {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('table') // 'table' | 'timeline'

  const load = async () => {
    setErrorMessage('')
    try {
      const response = await fetchAllBookings()
      setBookings(response.bookings || [])
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to load bookings')
      setBookings([])
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleStatusChange = async (bookingId, newStatus, currentStatus) => {
    if (newStatus === currentStatus) return
    if (!window.confirm(`Change booking status from "${currentStatus}" to "${newStatus}"?`)) return
    setErrorMessage('')
    try {
      await updateBookingStatus(bookingId, newStatus)
      toast.success(`Status updated to ${newStatus}`)
      await load()
    } catch (error) {
      const message = extractErrorMessage(error, 'Status update failed')
      setErrorMessage(message)
      toast.error(message)
    }
  }

  const filtered = useMemo(() => {
    let list = [...bookings]
    if (statusFilter !== 'all') {
      list = list.filter(b => b.status === statusFilter)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(b => {
        const name = b.vehicle?.name || `${b.vehicle?.brand || ''} ${b.vehicle?.model || ''}`
        const user = b.user?.name || b.user?.email || ''
        return name.toLowerCase().includes(q) || user.toLowerCase().includes(q)
      })
    }
    list.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    return list
  }, [bookings, statusFilter, searchQuery])

  const counts = useMemo(() => ({
    all: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }), [bookings])

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const exportToCSV = () => {
    if (filtered.length === 0) {
      toast.error('No bookings to export')
      return
    }
    const headers = ['Customer', 'Email', 'Vehicle', 'Start Date', 'End Date', 'Amount', 'Status']
    const rows = filtered.map(b => [
      b.user?.name || 'Unknown',
      b.user?.email || '',
      b.vehicle?.name || `${b.vehicle?.brand || ''} ${b.vehicle?.model || ''}`.trim(),
      fmtDate(b.startDate),
      fmtDate(b.endDate),
      b.totalPrice || 0,
      b.status,
    ])
    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings_${statusFilter}_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${filtered.length} bookings`)
  }

  return (
    <AdminShell title="Booking Schedule" eyebrow="Reservation Management">
      <InlineError message={errorMessage} onRetry={load} />

      <div className="admin-toolbar">
        <div className="admin-filter-tabs">
          {['all', 'active', 'completed', 'cancelled'].map(key => (
            <button
              key={key}
              className={`admin-filter-tab ${statusFilter === key ? 'active' : ''}`}
              onClick={() => setStatusFilter(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <span className="admin-filter-count">{counts[key]}</span>
            </button>
          ))}
        </div>
        <div className="admin-toolbar-info">
          <div className="admin-search-box">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* View Toggle */}
          <div className="admin-view-toggle">
            <button
              className={`admin-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
            <button
              className={`admin-toggle-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              Timeline
            </button>
          </div>
          <button className="btn ghost btn-sm" onClick={exportToCSV}>
            Export CSV
          </button>
        </div>
      </div>

      {loading ? (
        <div className="route-loader">Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No bookings found for the selected filter.</div>
      ) : viewMode === 'timeline' ? (
        <BookingTimeline bookings={filtered} />
      ) : (
        <section className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Dates</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking, idx) => {
                const vehicleName = booking.vehicle?.name || `${booking.vehicle?.brand || ''} ${booking.vehicle?.model || ''}`.trim() || 'N/A'
                const customerName = booking.user?.name || booking.user?.email || 'Unknown'
                const statusStyle = STATUS_CONFIG[booking.status] || STATUS_CONFIG.active
                return (
                  <tr key={booking._id}>
                    <td className="admin-td-num">{idx + 1}</td>
                    <td>
                      <div className="admin-vehicle-cell">
                        <strong>{customerName}</strong>
                        <span>{booking.user?.email || ''}</span>
                      </div>
                    </td>
                    <td><strong>{vehicleName}</strong></td>
                    <td>
                      <div className="admin-date-range">
                        <span>{fmtDate(booking.startDate)}</span>
                        <span className="admin-date-arrow">→</span>
                        <span>{fmtDate(booking.endDate)}</span>
                      </div>
                    </td>
                    <td><strong>₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</strong></td>
                    <td>
                      <span className="admin-status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-status-select"
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value, booking.status)}
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      )}
    </AdminShell>
  )
}

export default BookingSchedule
