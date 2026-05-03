import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { fetchAllBookings } from '../../api/bookingApi'
import { deleteVehicle, fetchVehicles, updateVehicle } from '../../api/vehicleApi'
import InlineError from '../../components/feedback/InlineError'
import AdminShell from '../../components/layout/AdminShell'
import extractErrorMessage from '../../utils/extractErrorMessage'
import { getVehicleImageCandidates } from '../../utils/vehicleImageResolver'

const STATUS_STYLES = {
  available: { bg: 'rgba(52,211,153,0.14)', color: '#34d399', label: 'Available' },
  booked: { bg: 'rgba(251,191,36,0.14)', color: '#fbbf24', label: 'Booked' },
  disabled: { bg: 'rgba(248,113,113,0.14)', color: '#f87171', label: 'Disabled' },
}

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [activeBookingVehicleIds, setActiveBookingVehicleIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const loadData = async () => {
    setErrorMessage('')
    try {
      const [vehiclesRes, bookingsRes] = await Promise.all([fetchVehicles(), fetchAllBookings()])
      setVehicles(vehiclesRes.vehicles || [])

      const activeIds = new Set()
      const now = new Date()
      for (const b of (bookingsRes.bookings || [])) {
        if (b.status === 'active' && new Date(b.endDate) >= now) {
          const vid = typeof b.vehicle === 'string' ? b.vehicle : b.vehicle?._id
          if (vid) activeIds.add(vid)
        }
      }
      setActiveBookingVehicleIds(activeIds)
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to load vehicles')
      setVehicles([])
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const sortedVehicles = useMemo(() => {
    let list = [...vehicles].sort((a, b) => {
      const brandCmp = (a.brand || '').localeCompare(b.brand || '')
      return brandCmp !== 0 ? brandCmp : (a.model || '').localeCompare(b.model || '')
    })
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(v =>
        (v.name || '').toLowerCase().includes(q) ||
        (v.brand || '').toLowerCase().includes(q) ||
        (v.model || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [vehicles, searchQuery])

  const getVehicleStatus = (vehicle) => {
    if (!vehicle.isAvailable) return 'disabled'
    if (activeBookingVehicleIds.has(vehicle._id)) return 'booked'
    return 'available'
  }

  const toggleAvailability = async (vehicle) => {
    setErrorMessage('')
    try {
      await updateVehicle(vehicle._id, { isAvailable: !vehicle.isAvailable })
      toast.success(`${vehicle.name} ${vehicle.isAvailable ? 'disabled' : 'enabled'}`)
      await loadData()
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to update availability')
      setErrorMessage(message)
      toast.error(message)
    }
  }

  const handleDelete = async (vehicle) => {
    if (!window.confirm(`Delete ${vehicle.name}? This cannot be undone.`)) return
    setErrorMessage('')
    try {
      await deleteVehicle(vehicle._id)
      toast.success('Vehicle removed from fleet')
      await loadData()
    } catch (error) {
      const message = extractErrorMessage(error, 'Failed to delete vehicle')
      setErrorMessage(message)
      toast.error(message)
    }
  }

  return (
    <AdminShell title="Manage Fleet" eyebrow="Vehicle Operations">
      <InlineError message={errorMessage} onRetry={loadData} />

      <div className="admin-toolbar">
        <div className="admin-search-box">
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="admin-toolbar-info">
          <span className="admin-count-badge">{sortedVehicles.length} vehicles</span>
          <Link className="btn solid btn-sm" to="/admin/vehicles/add">
            + Add Vehicle
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="route-loader">Loading fleet data...</div>
      ) : sortedVehicles.length === 0 ? (
        <div className="empty-state">No vehicles found.</div>
      ) : (
        <section className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th></th>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Year</th>
                <th>Rate/Day</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedVehicles.map((vehicle, idx) => {
                const status = getVehicleStatus(vehicle)
                const style = STATUS_STYLES[status]
                const imgSrc = getVehicleImageCandidates(vehicle)[0]
                return (
                  <tr key={vehicle._id}>
                    <td className="admin-td-num">{idx + 1}</td>
                    <td>
                      <div className="admin-thumb">
                        <img src={imgSrc} alt="" loading="lazy" onError={(e) => { e.target.style.display = 'none' }} />
                      </div>
                    </td>
                    <td>
                      <div className="admin-vehicle-cell">
                        <strong>{vehicle.brand}</strong>
                        <span>{vehicle.model}</span>
                      </div>
                    </td>
                    <td><span className="admin-type-badge">{vehicle.type}</span></td>
                    <td>{vehicle.year}</td>
                    <td>₹{(vehicle.dailyRate || 0).toLocaleString('en-IN')}</td>
                    <td>
                      <span className="admin-status-badge" style={{ background: style.bg, color: style.color }}>
                        {style.label}
                      </span>
                    </td>
                    <td>
                      <div className="admin-action-btns">
                        <button
                          className={`admin-btn-sm ${vehicle.isAvailable ? 'warn' : 'success'}`}
                          onClick={() => toggleAvailability(vehicle)}
                        >
                          {vehicle.isAvailable ? 'Disable' : 'Enable'}
                        </button>
                        <button
                          className="admin-btn-sm danger"
                          onClick={() => handleDelete(vehicle)}
                        >
                          Delete
                        </button>
                      </div>
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

export default ManageVehicles
