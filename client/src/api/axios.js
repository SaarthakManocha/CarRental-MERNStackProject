import axios from 'axios'

const TOKEN_KEY = 'car_rental_token'

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY)
export const setStoredToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearStoredToken = () => localStorage.removeItem(TOKEN_KEY)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
