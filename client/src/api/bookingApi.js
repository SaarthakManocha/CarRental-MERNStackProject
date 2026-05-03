import api from './axios'

export const createBooking = async (payload) => {
  const { data } = await api.post('/bookings', payload)
  return data
}

export const fetchMyBookings = async () => {
  const { data } = await api.get('/bookings/my')
  return data
}

export const cancelBooking = async (bookingId) => {
  const { data } = await api.patch(`/bookings/${bookingId}/cancel`)
  return data
}

export const fetchAllBookings = async () => {
  const { data } = await api.get('/bookings/all')
  return data
}

export const updateBookingStatus = async (bookingId, status) => {
  const { data } = await api.patch(`/bookings/${bookingId}/status`, { status })
  return data
}
