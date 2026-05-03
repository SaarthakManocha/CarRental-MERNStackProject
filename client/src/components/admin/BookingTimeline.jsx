import { useMemo } from 'react'

const STATUS_COLORS = {
  active: '#34d399',
  completed: '#60a5fa',
  cancelled: '#f87171',
}

const fmtShort = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })

const BookingTimeline = ({ bookings }) => {
  const { rows, dayLabels, totalDays, startDate } = useMemo(() => {
    if (!bookings.length) return { rows: [], dayLabels: [], totalDays: 0, startDate: null }

    // Find the date range across all bookings
    let minDate = Infinity
    let maxDate = -Infinity
    for (const b of bookings) {
      const s = new Date(b.startDate).getTime()
      const e = new Date(b.endDate).getTime()
      if (s < minDate) minDate = s
      if (e > maxDate) maxDate = e
    }

    // Pad 1 day on each side
    const DAY = 86400000
    const rangeStart = new Date(minDate - DAY)
    rangeStart.setHours(0, 0, 0, 0)
    const rangeEnd = new Date(maxDate + DAY)
    rangeEnd.setHours(0, 0, 0, 0)
    const total = Math.ceil((rangeEnd - rangeStart) / DAY) + 1

    // Generate day labels (show every 3rd or 5th day based on range)
    const step = total > 30 ? 7 : total > 14 ? 3 : 1
    const labels = []
    for (let i = 0; i < total; i += step) {
      const d = new Date(rangeStart.getTime() + i * DAY)
      labels.push({ offset: (i / total) * 100, label: fmtShort(d) })
    }

    // Map bookings to rows
    const mapped = bookings.map((b) => {
      const bStart = new Date(b.startDate)
      bStart.setHours(0, 0, 0, 0)
      const bEnd = new Date(b.endDate)
      bEnd.setHours(0, 0, 0, 0)

      const offsetDays = (bStart - rangeStart) / DAY
      const durationDays = Math.max(1, (bEnd - bStart) / DAY)

      const left = (offsetDays / total) * 100
      const width = (durationDays / total) * 100

      const vehicleName = b.vehicle?.name || `${b.vehicle?.brand || ''} ${b.vehicle?.model || ''}`.trim() || 'Vehicle'
      const customerName = b.user?.name || 'Customer'

      return {
        id: b._id,
        left: Math.max(0, left),
        width: Math.min(width, 100 - left),
        color: STATUS_COLORS[b.status] || STATUS_COLORS.active,
        status: b.status,
        vehicleName,
        customerName,
        dateLabel: `${fmtShort(b.startDate)} → ${fmtShort(b.endDate)}`,
        amount: b.totalPrice || 0,
      }
    })

    // Sort: active first, then by start date
    mapped.sort((a, b) => {
      const order = { active: 0, completed: 1, cancelled: 2 }
      const statusDiff = (order[a.status] || 0) - (order[b.status] || 0)
      return statusDiff !== 0 ? statusDiff : a.left - b.left
    })

    return { rows: mapped, dayLabels: labels, totalDays: total, startDate: rangeStart }
  }, [bookings])

  if (!rows.length) {
    return <div className="empty-state">No bookings to display in timeline.</div>
  }

  return (
    <div className="timeline-container">
      {/* Date axis */}
      <div className="timeline-axis">
        {dayLabels.map((d, i) => (
          <span key={i} className="timeline-axis-label" style={{ left: `${d.offset}%` }}>
            {d.label}
          </span>
        ))}
      </div>

      {/* Booking rows */}
      <div className="timeline-rows">
        {rows.map((row) => (
          <div key={row.id} className="timeline-row">
            <div className="timeline-row-label">
              <strong>{row.vehicleName}</strong>
              <span>{row.customerName}</span>
            </div>
            <div className="timeline-track">
              {/* Grid lines */}
              {dayLabels.map((d, i) => (
                <div key={i} className="timeline-gridline" style={{ left: `${d.offset}%` }} />
              ))}
              {/* Bar */}
              <div
                className="timeline-bar"
                style={{
                  left: `${row.left}%`,
                  width: `${Math.max(row.width, 1.5)}%`,
                  backgroundColor: row.color,
                }}
                title={`${row.vehicleName} — ${row.customerName}\n${row.dateLabel}\n₹${row.amount.toLocaleString('en-IN')} — ${row.status}`}
              >
                <span className="timeline-bar-text">
                  {row.dateLabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="timeline-legend">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="timeline-legend-item">
            <span className="timeline-legend-dot" style={{ backgroundColor: color }} />
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BookingTimeline
