import { Suspense, lazy, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'

import ProtectedRoute from './components/guards/ProtectedRoute'
import RoleGuard from './components/guards/RoleGuard'
import Footer from './components/layout/Footer'
import Navbar from './components/layout/Navbar'
import { AuthProvider } from './context/AuthContext'
import './App.css'

const Landing = lazy(() => import('./pages/Landing'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Showroom = lazy(() => import('./pages/Showroom'))
const BrandFleet = lazy(() => import('./pages/BrandFleet'))
const VehicleDetail = lazy(() => import('./pages/VehicleDetail'))
const MyBookings = lazy(() => import('./pages/MyBookings'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const ManageVehicles = lazy(() => import('./pages/admin/ManageVehicles'))
const AddVehicle = lazy(() => import('./pages/admin/AddVehicle'))
const BookingSchedule = lazy(() => import('./pages/admin/BookingSchedule'))
const NotFound = lazy(() => import('./pages/NotFound'))

const AppRoutes = () => {
  const location = useLocation()

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="route-loader">Loading page...</div>}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/showroom" element={<Showroom />} />
            <Route path="/fleet/:brand" element={<BrandFleet />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={['admin']}>
                    <Dashboard />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicles"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={['admin']}>
                    <ManageVehicles />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vehicles/add"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={['admin']}>
                    <AddVehicle />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute>
                  <RoleGuard roles={['admin']}>
                    <BookingSchedule />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Footer />
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
