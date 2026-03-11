import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HiMiniChartBarSquare, HiOutlineCalendarDays, HiOutlineClipboardDocumentList, HiOutlineCreditCard, HiOutlinePlusCircle, HiOutlineUserCircle } from 'react-icons/hi2'
import API, { formatEventDate } from '../api/api'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../stores/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [searchParams] = useSearchParams()
  const [stats, setStats] = useState({})
  const [bookings, setBookings] = useState([])
  const [events, setEvents] = useState([])
  const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'bookings')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createState, setCreateState] = useState({ loading: false, error: '', success: '' })

  useEffect(() => {
    const section = searchParams.get('section')
    if (section) setActiveSection(section)
  }, [searchParams])

  useEffect(() => {
    let ignore = false

    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const requests = [API.get('/events')]

        if (user.role === 'organizer') {
          requests.push(API.get('/analytics/summary'))
          requests.push(API.get('/bookings/all'))
        } else {
          requests.push(API.get('/bookings/my-bookings'))
        }

        const response = await Promise.all(requests)
        if (ignore) return

        setEvents(response[0].data || [])

        if (user.role === 'organizer') {
          setStats(response[1].data || {})
          setBookings(response[2].data || [])
        } else {
          const myBookings = response[1].data || []
          setBookings(myBookings)
          setStats({
            totalBookings: myBookings.length,
            upcomingEvents: myBookings.filter((booking) => new Date(booking.eventId?.date || booking.createdAt) > new Date()).length,
            revenue: myBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
          })
        }
      } catch {
        if (!ignore) setError('Unable to load dashboard data right now.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      ignore = true
    }
  }, [user.role])

  const organizerEvents = user.role === 'organizer' ? events.filter((event) => event.organizerId === user._id) : []
  const upcomingEvents = user.role === 'organizer'
    ? organizerEvents.filter((event) => new Date(event.date) > new Date())
    : bookings.map((booking) => booking.eventId).filter(Boolean).filter((event, index, list) => list.findIndex((item) => item._id === event._id) === index)

  const sidebarItems = user.role === 'organizer'
    ? [
        { id: 'bookings', label: 'Attendees', icon: <HiOutlineClipboardDocumentList /> },
        { id: 'events', label: 'Upcoming Events', icon: <HiOutlineCalendarDays /> },
        { id: 'payments', label: 'Payment History', icon: <HiOutlineCreditCard /> },
        { id: 'create', label: 'Create Event', icon: <HiOutlinePlusCircle /> },
        { id: 'profile', label: 'Profile', icon: <HiOutlineUserCircle /> }
      ]
    : [
        { id: 'bookings', label: 'My Bookings', icon: <HiOutlineClipboardDocumentList /> },
        { id: 'events', label: 'Upcoming Events', icon: <HiOutlineCalendarDays /> },
        { id: 'payments', label: 'Payment History', icon: <HiOutlineCreditCard /> },
        { id: 'profile', label: 'Profile', icon: <HiOutlineUserCircle /> }
      ]

  async function refreshEvents() {
    const response = await API.get('/events')
    setEvents(response.data || [])
  }

  async function handleCreateEvent(event) {
    event.preventDefault()
    const formData = new FormData(event.target)

    setCreateState({ loading: true, error: '', success: '' })

    try {
      await API.post('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      await refreshEvents()
      event.target.reset()
      setCreateState({ loading: false, error: '', success: 'Event created successfully.' })
      setActiveSection('events')
    } catch (err) {
      setCreateState({
        loading: false,
        error: err.response?.data?.message || 'Unable to create the event.',
        success: ''
      })
    }
  }

  async function handleDeleteEvent(eventId) {
    try {
      await API.delete(`/events/${eventId}`)
      await refreshEvents()
    } catch {
      setError('Unable to delete the selected event.')
    }
  }

  function renderSection() {
    if (activeSection === 'bookings') {
      return (
        <div className="space-y-4">
          {bookings.length === 0 ? <div className="empty-state">No booking activity yet.</div> : bookings.map((booking) => (
            <article key={booking._id} className="rounded-[28px] border border-primary/10 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-900">{booking.eventName || booking.eventId?.title || 'Event booking'}</div>
                  <div className="mt-2 text-sm text-slate-500">
                    {user.role === 'organizer' ? `${booking.userName || 'Attendee'}${booking.email ? ` · ${booking.email}` : ''}` : 'Your booking'}
                  </div>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-soft">
                  Seats: {booking.seats?.join(', ') || 'NA'}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-white px-3 py-2">Amount: ₹{booking.totalAmount || 0}</span>
                <span className="rounded-full bg-white px-3 py-2 capitalize">Status: {booking.bookingStatus || 'pending'}</span>
                <span className="rounded-full bg-white px-3 py-2">{formatEventDate(booking.createdAt)}</span>
              </div>
            </article>
          ))}
        </div>
      )
    }

    if (activeSection === 'events') {
      return (
        <div className="space-y-4">
          {upcomingEvents.length === 0 ? <div className="empty-state">No upcoming events available.</div> : upcomingEvents.map((event) => (
            <article key={event._id} className="rounded-[28px] border border-primary/10 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-900">{event.title}</div>
                  <div className="mt-2 text-sm text-slate-500">{formatEventDate(event.date)} · {event.location}</div>
                </div>
                {user.role === 'organizer' ? (
                  <button onClick={() => handleDeleteEvent(event._id)} className="btn-secondary text-rose-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                    Remove
                  </button>
                ) : (
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700">Ready to attend</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )
    }

    if (activeSection === 'payments') {
      return (
        <div className="space-y-4">
          {bookings.length === 0 ? <div className="empty-state">No payment records available yet.</div> : bookings.map((booking) => (
            <article key={booking._id} className="rounded-[28px] border border-primary/10 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-bold text-slate-900">{booking.eventName || booking.eventId?.title || 'Payment record'}</div>
                  <div className="mt-2 text-sm text-slate-500">Processed through the booking workflow</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Amount</div>
                  <div className="text-2xl font-black text-slate-900">₹{booking.totalAmount || 0}</div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-white px-3 py-2 capitalize">Booking: {booking.bookingStatus || 'pending'}</span>
                <span className="rounded-full bg-white px-3 py-2">{formatEventDate(booking.createdAt)}</span>
              </div>
            </article>
          ))}
        </div>
      )
    }

    if (activeSection === 'create' && user.role === 'organizer') {
      return (
        <form onSubmit={handleCreateEvent} className="grid gap-5 md:grid-cols-2">
          <label className="field-label md:col-span-2">
            <span>Event Title</span>
            <input name="title" className="input-field" placeholder="Event name" required />
          </label>
          <label className="field-label md:col-span-2">
            <span>Description</span>
            <textarea name="description" className="input-field min-h-32" placeholder="Tell attendees what to expect" />
          </label>
          <label className="field-label">
            <span>Date & Time</span>
            <input name="date" type="datetime-local" className="input-field" required />
          </label>
          <label className="field-label">
            <span>Location</span>
            <input name="location" className="input-field" placeholder="City or venue" required />
          </label>
          <label className="field-label">
            <span>Ticket Price</span>
            <input name="ticketPrice" type="number" min="0" className="input-field" placeholder="999" required />
          </label>
          <label className="field-label">
            <span>Total Seats</span>
            <input name="totalSeats" type="number" min="1" className="input-field" placeholder="250" required />
          </label>
          <label className="field-label">
            <span>Status</span>
            <select name="status" className="input-field" defaultValue="published">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="field-label">
            <span>Event Image</span>
            <input name="image" type="file" accept="image/*" className="input-field file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-semibold file:text-primary-dark" />
          </label>

          {createState.error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 md:col-span-2">{createState.error}</div> : null}
          {createState.success ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600 md:col-span-2">{createState.success}</div> : null}

          <div className="md:col-span-2">
            <button type="submit" disabled={createState.loading} className="btn-primary">
              {createState.loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      )
    }

    return (
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[28px] border border-primary/10 bg-slate-50 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Profile</div>
          <div className="mt-4 text-2xl font-black text-slate-900">{user.name}</div>
          <div className="mt-2 text-sm text-slate-500">{user.email}</div>
          <div className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold capitalize text-primary-dark shadow-soft">
            {user.role}
          </div>
        </div>
        <div className="rounded-[28px] border border-primary/10 bg-slate-50 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Workspace Snapshot</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
              <span>Bookings</span>
              <strong>{stats.totalBookings || bookings.length || 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
              <span>Revenue</span>
              <strong>₹{stats.revenue || 0}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
              <span>Upcoming</span>
              <strong>{upcomingEvents.length}</strong>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="card-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">Dashboard</p>
            <h1 className="section-title">{user.role === 'organizer' ? 'Organizer control room' : 'Your booking workspace'}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Track bookings, upcoming events, payment activity, and profile details from a single place.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="stat-card">
              <HiMiniChartBarSquare className="text-xl text-primary" />
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Bookings</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{stats.totalBookings || bookings.length || 0}</div>
            </div>
            <div className="stat-card">
              <HiOutlineCalendarDays className="text-xl text-primary" />
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Upcoming</div>
              <div className="mt-2 text-3xl font-black text-slate-900">{upcomingEvents.length}</div>
            </div>
            <div className="stat-card">
              <HiOutlineCreditCard className="text-xl text-primary" />
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Revenue</div>
              <div className="mt-2 text-3xl font-black text-slate-900">₹{stats.revenue || 0}</div>
            </div>
          </div>
        </div>
      </section>

      {error ? <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-700">{error}</div> : null}

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar items={sidebarItems} activeSection={activeSection} onSelect={setActiveSection} />
        <div className="card-surface p-6">
          {loading ? <div className="empty-state">Loading dashboard data...</div> : renderSection()}
        </div>
      </section>
    </div>
  )
}
