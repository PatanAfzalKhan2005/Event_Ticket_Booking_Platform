import React from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { HiCheckBadge, HiOutlineArrowRight } from 'react-icons/hi2'
import { formatEventDate } from '../api/api'

export default function PaymentSuccess() {
  const { state } = useLocation()
  const booking = state?.booking

  if (!booking) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-4xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="card-surface w-full p-8 text-center sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <HiCheckBadge className="text-4xl" />
        </div>
        <div className="mt-6">
          <div className="badge-pill mx-auto">Payment Success</div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900">Booking Successful</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">Your tickets have been confirmed and are now visible inside your dashboard workspace.</p>
        </div>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
          <div className="rounded-[24px] bg-slate-50 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Event Name</div>
            <div className="mt-3 text-lg font-bold text-slate-900">{booking.eventName}</div>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Date</div>
            <div className="mt-3 text-lg font-bold text-slate-900">{formatEventDate(booking.eventDate)}</div>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Ticket Count</div>
            <div className="mt-3 text-lg font-bold text-slate-900">{booking.seats?.length || 0}</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link to="/dashboard" className="btn-primary">
            <span>Back to Dashboard</span>
            <HiOutlineArrowRight className="text-base" />
          </Link>
          <Link to="/events" className="btn-secondary">Browse More Events</Link>
        </div>
      </section>
    </div>
  )
}
