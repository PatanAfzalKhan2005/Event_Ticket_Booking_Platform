import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineArrowRight } from 'react-icons/hi2'
import API from '../api/api'

export default function Register() {
  const nav = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = Object.fromEntries(new FormData(e.target))

    try {
      await API.post('/auth/register', form)
      nav('/login', { state: { registered: true } })
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.response?.status ? `Registration failed with status ${err.response.status}.` : null) ||
        err.message ||
        'Registration failed. Please review your details and try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
      <section className="mx-auto flex w-full max-w-lg items-center lg:order-2">
        <div className="card-surface w-full p-8 sm:p-10">
          <div className="mb-8">
            <div className="badge-pill mb-4">Create account</div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Join EventSphere</h2>
            <p className="mt-2 text-sm text-slate-500">Register as an attendee to book tickets or as an organizer to publish and manage events.</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <label className="field-label">
              <span>Full Name</span>
              <input name="name" placeholder="Your full name" className="input-field" autoComplete="name" required />
            </label>

            <label className="field-label">
              <span>Email Address</span>
              <input name="email" type="email" placeholder="you@example.com" className="input-field" autoComplete="email" required />
            </label>

            <label className="field-label">
              <span>Password</span>
              <input name="password" type="password" placeholder="Create a password" className="input-field" autoComplete="new-password" required minLength="6" />
            </label>

            <label className="field-label">
              <span>Account Type</span>
              <select name="role" className="input-field" defaultValue="attendee">
                <option value="attendee">Attendee</option>
                <option value="organizer">Organizer</option>
              </select>
            </label>

            {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div> : null}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              <span>{loading ? 'Creating Account...' : 'Register'}</span>
              <HiOutlineArrowRight className="text-base" />
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary transition hover:text-primary-dark">
              Login here
            </Link>
          </p>
        </div>
      </section>

      <section className="hero-panel lg:order-1">
        <div className="max-w-xl space-y-6">
          <div className="badge-pill bg-white/12 text-white ring-white/10">Professional purple theme</div>
          <h1 className="text-5xl font-black tracking-tight text-white">Build, launch, and sell standout event experiences.</h1>
          <p className="text-lg leading-8 text-white/82">
            Create an account to manage bookings, track revenue, and keep event operations visible from a single workspace.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">Attendee</div>
              <div className="mt-2 text-sm text-white/86">Browse and book live events fast.</div>
            </div>
            <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">Organizer</div>
              <div className="mt-2 text-sm text-white/86">Create events and manage attendees.</div>
            </div>
            <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/72">Payments</div>
              <div className="mt-2 text-sm text-white/86">Follow bookings through a clean success flow.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
