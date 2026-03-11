import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { HiCalendarDays, HiMapPin, HiOutlineTicket } from 'react-icons/hi2'
import API, { formatEventDate, getImageUrl } from '../api/api'

export default function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    let ignore = false

    async function loadEvent() {
      setError('')

      try {
        const response = await API.get(`/events/${id}`)
        if (!ignore) setEvent(response.data)
      } catch {
        if (!ignore) setError('Unable to load the selected event.')
      }
    }

    loadEvent()

    return () => {
      ignore = true
    }
  }, [id])

  if (error) {
    return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-700">{error}</div></div>
  }

  if (!event) {
    return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"><div className="card-surface p-8 text-center text-sm text-slate-500">Loading event details...</div></div>
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface overflow-hidden p-3">
          <img src={getImageUrl(event.eventImage)} className="h-[420px] w-full rounded-[28px] object-cover" alt={event.title} />
        </div>

        <div className="card-surface p-8">
          <div className="badge-pill mb-4">Event Details</div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">{event.title}</h1>
          <p className="mt-4 text-base leading-8 text-slate-600">{event.description || 'No description has been added for this event yet.'}</p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
              <HiCalendarDays className="text-xl text-primary" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Date</div>
                <div className="text-sm font-semibold text-slate-900">{formatEventDate(event.date)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
              <HiMapPin className="text-xl text-primary" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Location</div>
                <div className="text-sm font-semibold text-slate-900">{event.location || 'Venue to be confirmed'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4">
              <HiOutlineTicket className="text-xl text-primary" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Ticket Price</div>
                <div className="text-sm font-semibold text-slate-900">₹{event.ticketPrice ?? 0}</div>
              </div>
            </div>
          </div>

          <button className="btn-primary mt-8 w-full justify-center" onClick={() => nav('/seat-booking', { state: { event } })}>
            Book Ticket
          </button>
        </div>
      </section>
    </div>
  )
}
