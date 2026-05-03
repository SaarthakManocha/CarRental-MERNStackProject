import { NavLink } from 'react-router-dom'

const adminNavClass = ({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <p className="eyebrow">Admin Panel</p>
      <h3>Operations</h3>
      <nav className="admin-nav" aria-label="Admin routes">
        <NavLink to="/admin/dashboard" className={adminNavClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/admin/vehicles" className={adminNavClass}>
          Fleet Manager
        </NavLink>
        <NavLink to="/admin/vehicles/add" className={adminNavClass}>
          Add Vehicle
        </NavLink>
        <NavLink to="/admin/bookings" className={adminNavClass}>
          Booking Schedule
        </NavLink>
      </nav>
    </aside>
  )
}

export default AdminSidebar
