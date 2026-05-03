import { Navigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'

const RoleGuard = ({ roles = [], children }) => {
  const { isLoading, hasRole } = useAuth()

  if (isLoading) {
    return <div className="route-loader">Verifying access...</div>
  }

  if (!hasRole(roles)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RoleGuard
