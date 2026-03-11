import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HiOutlineCreditCard, HiOutlineTicket } from 'react-icons/hi2'
import { useBookingStore } from '../stores/bookingStore'
import API, { formatEventDate, getImageUrl } from '../api/api'

function Seat({ num, status, onClick, selected }) {
  const classes = status === 'booked'
    ? 'cursor-not-allowed bg-slate-200 text-slate-400'
    : selected
      ? 'bg-primary-dark text-white shadow-purple'
      : 'bg-primary/10 text-primary-dark hover:bg-primary/20'

  return (
    <button
      type="button"
      onClick={() => status === 'available' && onClick(num)}
      className={`rounded-2xl px-3 py-4 text-sm font-bold transition ${classes}`}
    >
      {num}
    </button>
  )
}

export default function SeatBooking() {
  const { state } = useLocation()
  const { event } = state || {}
  const [seats, setSeats] = useState([])
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const { selectedSeats, selectSeat, clearSeats } = useBookingStore()
  const nav = useNavigate()

  useEffect(() => {
    if (!event) {
      nav('/events')
      return
    }

    let ignore = false

    async function loadSeats() {
      setError('')

      try {
        const response = await API.get(`/events/${event._id}/seats`)
        if (!ignore) setSeats(response.data || [])
      } catch {
        if (!ignore) setError('Unable to load seat availability.')
      }
    }

    loadSeats()

    return () => {
      ignore = true
    }
  }, [event, nav])

  async function handlePay() {
    setError('')
    setProcessing(true)

    try {
      const res = await API.post('/bookings/create', { eventId: event._id, seats: selectedSeats })
      const { booking, payment } = res.data
      await API.post('/payments/process', { paymentId: payment._id })
      clearSeats()
      nav('/payment-success', {
        state: {
          booking: {
            ...booking,
            eventName: event.title,
            eventDate: event.date
          }
        }
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="card-surface p-6">
          <div className="section-heading">
            <div>
              <p className="section-kicker">Payment Page</p>
              <h1 className="section-title">Select seats and confirm your booking</h1>
            </div>
          </div>

          {error ? <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</div> : null}

          <div className="mb-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            <span className="rounded-full bg-slate-100 px-3 py-2">Available</span>
            <span className="rounded-full bg-primary/10 px-3 py-2 text-primary-dark">Selected</span>
            <span className="rounded-full bg-slate-200 px-3 py-2 text-slate-500">Booked</span>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
            {seats.map((seat) => (
              <Seat
                key={seat.seatNumber}
                num={seat.seatNumber}
                status={seat.status}
                selected={selectedSeats.includes(seat.seatNumber)}
                onClick={(number) => selectSeat(number)}
              />
            ))}
          </div>
        </div>

        <aside className="card-surface overflow-hidden p-3">
          <img src={getImageUrl(event?.eventImage)} alt={event?.title} className="h-56 w-full rounded-[28px] object-cover" />
          <div className="space-y-5 p-5">
            <div>
              <div className="badge-pill mb-4">Booking Summary</div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">{event?.title}</h2>
              <p className="mt-2 text-sm text-slate-500">{formatEventDate(event?.date)} · {event?.location}</p>
            </div>

            <div className="rounded-[24px] bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <HiOutlineTicket className="text-xl text-primary" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Ticket Count</div>
                  <div className="text-lg font-bold text-slate-900">{selectedSeats.length}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <HiOutlineCreditCard className="text-xl text-primary" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Amount</div>
                  <div className="text-lg font-bold text-slate-900">₹{selectedSeats.length * (event?.ticketPrice || 0)}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
              Selected Seats: {selectedSeats.length ? selectedSeats.join(', ') : 'Choose one or more seats to continue.'}
            </div>

            <button className="btn-primary w-full justify-center" onClick={handlePay} disabled={selectedSeats.length === 0 || processing}>
              {processing ? 'Processing Payment...' : 'Confirm Payment'}
            </button>
          </div>
        </aside>
      </section>
    </div>
  )
}
