const STATUS_CONFIG = {
  active: { bg: 'rgba(52,211,153,0.14)', color: '#34d399', label: 'Active' },
  completed: { bg: 'rgba(96,165,250,0.14)', color: '#60a5fa', label: 'Completed' },
  cancelled: { bg: 'rgba(248,113,113,0.14)', color: '#f87171', label: 'Cancelled' },
}

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const BookingCard = ({ booking, action }) => {
  const vehicleName = booking.vehicle?.name || `${booking.vehicle?.brand || ''} ${booking.vehicle?.model || ''}`.trim() || 'Vehicle'
  const brand = booking.vehicle?.brand || ''
  const statusStyle = STATUS_CONFIG[booking.status] || STATUS_CONFIG.active
  const days = Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / 86400000))

  return (
    <article className="booking-card-v2">
      <div className="bc-header">
        <div>
          <p className="bc-brand">{brand}</p>
          <h3 className="bc-name">{vehicleName}</h3>
        </div>
        <span className="admin-status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
          {statusStyle.label}
        </span>
      </div>
      <div className="bc-details">
        <div className="bc-detail-item">
          <span className="bc-detail-label">Duration</span>
          <span className="bc-detail-value">{days} {days === 1 ? 'day' : 'days'}</span>
        </div>
        <div className="bc-detail-item">
          <span className="bc-detail-label">From</span>
          <span className="bc-detail-value">{fmtDate(booking.startDate)}</span>
        </div>
        <div className="bc-detail-item">
          <span className="bc-detail-label">To</span>
          <span className="bc-detail-value">{fmtDate(booking.endDate)}</span>
        </div>
        <div className="bc-detail-item">
          <span className="bc-detail-label">Total</span>
          <span className="bc-detail-value bc-price">₹{(booking.totalPrice || 0).toLocaleString('en-IN')}</span>
        </div>
      </div>
      {action && <div className="bc-actions">{action}</div>}
    </article>
  )
}

export default BookingCard
