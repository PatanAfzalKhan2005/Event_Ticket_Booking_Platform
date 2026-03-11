import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HiArrowTrendingUp, HiCalendarDays, HiMiniSparkles, HiOutlineArrowRight, HiOutlineCreditCard, HiOutlineGlobeAlt, HiOutlineUsers } from 'react-icons/hi2'
import API, { formatEventDate } from '../api/api'
import EventCard from '../components/EventCard'
import { useAuthStore } from '../stores/authStore'

export default function Home() {
  const { user } = useAuthStore()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    let ignore = false

    async function loadEvents() {
      setLoading(true)
      setError('')

      try {
        const response = await API.get('/events')
        if (!ignore) setEvents(response.data || [])
      } catch {
        if (!ignore) setError('Unable to load event recommendations right now.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadEvents()

    return () => {
      ignore = true
    }
  }, [user])

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="hero-panel overflow-hidden">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <div className="badge-pill bg-white/12 text-white ring-white/10">EventSphere</div>
              <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">Book premium live experiences with a fintech-grade flow.</h1>
              <p className="max-w-2xl text-lg leading-8 text-white/82">
                Discover concerts, sports, comedy nights, and workshops inside a clean event platform designed for speed, clarity, and trust.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login" className="btn-light">
                  <span>Login</span>
                  <HiOutlineArrowRight className="text-base" />
                </Link>
                <Link to="/register" className="btn-ghost-light">Register</Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur-sm">
                <HiArrowTrendingUp className="text-2xl text-white" />
                <div className="mt-4 text-4xl font-black text-white">Fast</div>
                <div className="mt-2 text-sm leading-6 text-white/78">Search to booking completion in a single clear journey.</div>
              </div>
              <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur-sm">
                <HiOutlineCreditCard className="text-2xl text-white" />
                <div className="mt-4 text-4xl font-black text-white">Secure</div>
                <div className="mt-2 text-sm leading-6 text-white/78">JWT-backed authentication and a straightforward payment flow.</div>
              </div>
              <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur-sm">
                <HiOutlineUsers className="text-2xl text-white" />
                <div className="mt-4 text-4xl font-black text-white">Dual Role</div>
                <div className="mt-2 text-sm leading-6 text-white/78">Built for both attendees and organizers.</div>
              </div>
              <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur-sm">
                <HiOutlineGlobeAlt className="text-2xl text-white" />
                <div className="mt-4 text-4xl font-black text-white">Live</div>
                <div className="mt-2 text-sm leading-6 text-white/78">A modern event storefront with dashboard visibility.</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const featuredEvents = events.slice(0, 3)
  const trendingEvents = [...events].sort((a, b) => (b.ticketPrice || 0) - (a.ticketPrice || 0)).slice(0, 4)
  const quickBooking = events.slice(0, 4)
  const categories = ['Concerts', 'Tech Events', 'Sports', 'Comedy', 'Workshops']

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="hero-panel overflow-hidden">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="badge-pill bg-white/12 text-white ring-white/10">Welcome back, {user.name}</div>
            <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">Featured events, trending picks, and quick booking in one place.</h1>
            <p className="max-w-2xl text-lg leading-8 text-white/82">
              Browse upcoming experiences, jump into event details, and complete secure ticket purchases from your EventSphere workspace.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events" className="btn-light">
                <span>Explore Events</span>
                <HiOutlineArrowRight className="text-base" />
              </Link>
              <Link to="/dashboard" className="btn-ghost-light">Open Dashboard</Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur-sm">
              <HiMiniSparkles className="text-2xl text-white" />
              <div className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/74">Featured Events</div>
              <div className="mt-2 text-3xl font-black text-white">{events.length}</div>
              <div className="mt-2 text-sm text-white/78">Curated experiences ready to book.</div>
            </div>
            <div className="rounded-[28px] bg-white/12 p-6 backdrop-blur-sm">
              <HiCalendarDays className="text-2xl text-white" />
              <div className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/74">Role</div>
              <div className="mt-2 text-3xl font-black capitalize text-white">{user.role}</div>
              <div className="mt-2 text-sm text-white/78">Dashboard adapts to your workspace permissions.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="card-surface p-6">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Featured Events</p>
              <h2 className="section-title">Standout experiences this week</h2>
            </div>
            <Link to="/events" className="text-sm font-semibold text-primary hover:text-primary-dark">View all</Link>
          </div>
          {loading ? (
            <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">Loading featured events...</div>
          ) : error ? (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-700">{error}</div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredEvents.map((event) => <EventCard key={event._id} e={event} />)}
            </div>
          )}
        </div>

        <div className="card-surface p-6">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Event Categories</p>
              <h2 className="section-title">Browse by mood</h2>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category, index) => (
              <div key={category} className="rounded-[24px] border border-primary/10 bg-gradient-to-br from-primary/8 to-primary-light/10 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Category {index + 1}</div>
                <div className="mt-3 text-lg font-bold text-slate-900">{category}</div>
                <div className="mt-2 text-sm text-slate-500">High demand picks and curated recommendations.</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-surface p-6">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Quick Booking Cards</p>
              <h2 className="section-title">Pick a seat faster</h2>
            </div>
          </div>
          <div className="space-y-4">
            {quickBooking.map((event) => (
              <div key={event._id} className="flex items-center justify-between rounded-[24px] border border-primary/10 bg-slate-50 p-4">
                <div>
                  <div className="text-lg font-bold text-slate-900">{event.title}</div>
                  <div className="mt-1 text-sm text-slate-500">{formatEventDate(event.date)} · {event.location}</div>
                </div>
                <Link to={`/events/${event._id}`} className="btn-secondary">Book</Link>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Trending Events</p>
              <h2 className="section-title">High-value live experiences</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {trendingEvents.map((event) => (
              <Link
                key={event._id}
                to={`/events/${event._id}`}
                className="rounded-[28px] border border-primary/10 bg-gradient-to-br from-white to-primary/5 p-5 transition hover:-translate-y-1 hover:shadow-soft"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">Trending</div>
                <div className="mt-3 text-xl font-bold text-slate-900">{event.title}</div>
                <div className="mt-2 text-sm text-slate-500">{event.location}</div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-slate-500">{formatEventDate(event.date)}</span>
                  <span className="text-lg font-black text-slate-900">₹{event.ticketPrice}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
