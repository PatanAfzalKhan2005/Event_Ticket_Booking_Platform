import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineLockClosed, HiOutlineTicket } from 'react-icons/hi2'
import API from '../api/api'
import { useAuthStore } from '../stores/authStore'

export default function Login() {
  const nav = useNavigate()
  const { setUser } = useAuthStore()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = Object.fromEntries(new FormData(e.target))

    try {
      const res = await API.post('/auth/login', form)
      const token = res.data.token

      localStorage.setItem('token', token)

      const me = await API.get('/auth/me')
      setUser(me.data.user, token)
      nav('/home')
    } catch (err) {
      localStorage.removeItem('token')
      const message =
        err.response?.data?.message ||
        (err.response?.status ? `Login failed with status ${err.response.status}.` : null) ||
        err.message ||
        'Unable to sign in with those credentials.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <section className="hero-panel hidden lg:flex">
        <div className="max-w-xl space-y-6">
          <div className="badge-pill bg-white/12 text-white ring-white/10">PhonePe-inspired event commerce</div>
          <h1 className="text-5xl font-black tracking-tight text-white">Sign in and move straight from discovery to payment in minutes.</h1>
          <p className="text-lg leading-8 text-white/82">
            EventSphere combines fast booking, polished event discovery, and a dashboard built for both attendees and organizers.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm">
              <HiOutlineTicket className="text-2xl text-white" />
              <div className="mt-4 text-3xl font-black text-white">500+</div>
              <div className="mt-1 text-sm text-white/80">Live experiences ready to book</div>
            </div>
            <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm">
              <HiOutlineLockClosed className="text-2xl text-white" />
              <div className="mt-4 text-3xl font-black text-white">JWT</div>
              <div className="mt-1 text-sm text-white/80">Secure authenticated sessions</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-lg items-center">
        <div className="card-surface w-full p-8 sm:p-10">
          <div className="mb-8">
            <div className="badge-pill mb-4">Welcome back</div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Login to EventSphere</h2>
            <p className="mt-2 text-sm text-slate-500">Use your registered email and password to continue to your booking workspace.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="field-label">
              <span>Email Address</span>
              <input name="email" type="email" placeholder="you@example.com" className="input-field" autoComplete="email" required />
            </label>

            <label className="field-label">
              <span>Password</span>
              <input name="password" type="password" placeholder="Enter your password" className="input-field" autoComplete="current-password" required />
            </label>

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div> : null}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              <span>{loading ? 'Signing In...' : 'Login'}</span>
              <HiOutlineArrowRight className="text-base" />
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            New to EventSphere?{' '}
            <Link to="/register" className="font-semibold text-primary transition hover:text-primary-dark">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
