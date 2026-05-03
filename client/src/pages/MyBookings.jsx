import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { cancelBooking, fetchMyBookings } from '../api/bookingApi'
import AnimatedList from '../components/animations/AnimatedList'
import BookingCard from '../components/cards/BookingCard'
import InlineError from '../components/feedback/InlineError'
import PageWrapper from '../components/layout/PageWrapper'
import extractErrorMessage from '../utils/extractErrorMessage'

const MyBookings = () => {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [filter, setFilter] = useState('all')

  const loadBookings = async () => {
    setErrorMessage('')
    try {
      const response = await fetchMyBookings()
      setBookings(response.bookings || [])
    } catch (error) {
      const message = extractErrorMessage(error, 'Unable to load bookings')
      setBookings([])
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBookings() }, [])

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking? This action cannot be undone.')) return
    setErrorMessage('')
    try {
      await cancelBooking(bookingId)
      toast.success('Booking cancelled successfully')
      await loadBookings()
    } catch (error) {
      const message = extractErrorMessage(error, 'Cancel failed')
      setErrorMessage(message)
      toast.error(message)
    }
  }

  const counts = useMemo(() => ({
    all: bookings.length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }), [bookings])

  const filtered = useMemo(() => {
    if (filter === 'all') return bookings
    return bookings.filter(b => b.status === filter)
  }, [bookings, filter])

  return (
    <PageWrapper showAccents={false}>
      <section className="showroom-head">
        <p className="eyebrow">Customer Area</p>
        <h2>My Bookings</h2>
      </section>

      {/* Filter Tabs */}
      {bookings.length > 0 && (
        <div className="admin-filter-tabs" style={{ marginBottom: 20 }}>
          {['all', 'active', 'completed', 'cancelled'].map(key => (
            <button
              key={key}
              className={`admin-filter-tab ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <span className="admin-filter-count">{counts[key]}</span>
            </button>
          ))}
        </div>
      )}

      <InlineError message={errorMessage} onRetry={loadBookings} />

      {loading ? (
        <div className="route-loader">Loading your bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          {bookings.length === 0
            ? 'No bookings yet. Explore the showroom and book your first ride!'
            : 'No bookings match this filter.'}
        </div>
      ) : (
        <AnimatedList className="booking-list-v2">
          {filtered.map((booking) => {
            const isFuture = new Date(booking.startDate) > new Date()
            const canCancel = booking.status === 'active' && isFuture

            return (
              <BookingCard
                key={booking._id}
                booking={booking}
                action={
                  canCancel ? (
                    <button className="admin-btn-sm danger" onClick={() => handleCancel(booking._id)}>
                      Cancel Booking
                    </button>
                  ) : null
                }
              />
            )
          })}
        </AnimatedList>
      )}
    </PageWrapper>
  )
}

export default MyBookings
