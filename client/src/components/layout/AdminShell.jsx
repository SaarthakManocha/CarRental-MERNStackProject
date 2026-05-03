import AdminSidebar from './AdminSidebar'
import PageWrapper from './PageWrapper'

const AdminShell = ({ title, eyebrow = 'Admin', children }) => {
  return (
    <PageWrapper showAccents={false}>
      <div className="admin-shell">
        <AdminSidebar />
        <div className="admin-shell-content">
          <section className="showroom-head">
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </section>
          {children}
        </div>
      </div>
    </PageWrapper>
  )
}

export default AdminShell
