import { create } from 'zustand'
import API from '../api/api'

function readStoredUser() {
  const rawUser = localStorage.getItem('user')

  if (!rawUser) return null

  try {
    return JSON.parse(rawUser)
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

export const useAuthStore = create((set) => ({
  user: readStoredUser(),
  token: localStorage.getItem('token') || null,
  hydrated: false,
  setUser: (user, token) => {
    set({ user, token, hydrated: true })

    if (token) localStorage.setItem('token', token)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },
  logout: () => {
    set({ user: null, token: null, hydrated: true })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  init: async () => {
    const token = localStorage.getItem('token')
    const cachedUser = readStoredUser()

    if (!token) {
      set({ user: null, token: null, hydrated: true })
      return
    }

    if (cachedUser) {
      set({ user: cachedUser, token, hydrated: false })
    }

    try {
      const res = await API.get('/auth/me')
      localStorage.setItem('user', JSON.stringify(res.data.user))
      set({ user: res.data.user, token, hydrated: true })
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({ user: null, token: null, hydrated: true })
    }
  }
}))
