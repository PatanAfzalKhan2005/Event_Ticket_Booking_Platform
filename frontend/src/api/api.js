import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '')

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
  if (/^https?:\/\//i.test(path)) return path
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

export const formatEventDate = (value) =>
  value
    ? new Date(value).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    : 'Date TBA'

export default API
