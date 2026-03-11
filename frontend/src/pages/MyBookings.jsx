import React, { useEffect, useState } from 'react'
import API, { formatEventDate } from '../api/api'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadBookings() {
      try {
        const response = await API.get('/bookings/my-bookings')
        if (!ignore) setBookings(response.data || [])
      } catch {
        if (!ignore) setError('Unable to load your bookings.')
      }
    }

    loadBookings()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="card-surface p-6 sm:p-8">
        <p className="section-kicker">My Bookings</p>
        <h1 className="section-title">A full record of your reserved tickets</h1>
      </div>

      {error ? <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm font-medium text-amber-700">{error}</div> : null}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="card-surface p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xl font-bold text-slate-900">{booking.eventName || booking.eventId?.title || 'Booked Event'}</div>
                <div className="mt-2 text-sm text-slate-500">Seats: {booking.seats?.join(', ') || 'NA'}</div>
              </div>
              <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold capitalize text-primary-dark">
                {booking.bookingStatus || 'pending'}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-2">Amount: ₹{booking.totalAmount || 0}</span>
              <span className="rounded-full bg-slate-100 px-3 py-2">{formatEventDate(booking.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
