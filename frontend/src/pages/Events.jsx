import React, { useEffect, useState } from 'react'
import API from '../api/api'
import EventCard from '../components/EventCard'

export default function Events() {
  const [events, setEvents] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadEvents() {
      setLoading(true)
      setError('')

      try {
        const response = await API.get('/events')
        if (!ignore) setEvents(response.data || [])
      } catch {
        if (!ignore) setError('Unable to fetch events right now.')
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadEvents()

    return () => {
      ignore = true
    }
  }, [])

  const filteredEvents = events.filter((event) =>
    [event.title, event.location, event.description].filter(Boolean).join(' ').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="card-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">Events</p>
            <h1 className="section-title">Discover live events worth leaving home for</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Browse the full catalog, compare venues and dates, and move directly into ticket booking.
            </p>
          </div>
          <label className="field-label w-full max-w-md">
            <span>Search Events</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, city, or keyword"
              className="input-field"
            />
          </label>
        </div>
      </section>

      {error ? <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-700">{error}</div> : null}

      {loading ? (
        <div className="card-surface p-8 text-center text-sm text-slate-500">Loading events...</div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => <EventCard key={event._id} e={event} />)}
        </section>
      )}
    </div>
  )
}
