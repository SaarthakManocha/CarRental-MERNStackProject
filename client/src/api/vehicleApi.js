import api from './axios'

export const fetchVehicles = async (params = {}) => {
  const { data } = await api.get('/vehicles', { params })
  return data
}

export const fetchBrands = async () => {
  const { data } = await api.get('/vehicles/brands')
  return data
}

export const fetchVehiclesByBrand = async (brand) => {
  const { data } = await api.get(`/vehicles/brand/${brand}`)
  return data
}

export const fetchVehicleById = async (vehicleId) => {
  const { data } = await api.get(`/vehicles/${vehicleId}`)
  return data
}

export const checkVehicleAvailability = async (vehicleId, params) => {
  const { data } = await api.get(`/vehicles/${vehicleId}/availability`, { params })
  return data
}

export const createVehicle = async (payload) => {
  const { data } = await api.post('/vehicles', payload)
  return data
}

export const updateVehicle = async (vehicleId, payload) => {
  const { data } = await api.put(`/vehicles/${vehicleId}`, payload)
  return data
}

export const deleteVehicle = async (vehicleId) => {
  const { data } = await api.delete(`/vehicles/${vehicleId}`)
  return data
}

export const uploadVehicleImage = async (file, imageName) => {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('imageName', imageName)
  const { data } = await api.post('/vehicles/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
