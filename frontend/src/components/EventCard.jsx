import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiCalendarDays, HiMapPin, HiOutlineArrowRight } from 'react-icons/hi2'
import { formatEventDate, getImageUrl } from '../api/api'

export default function EventCard({ e }) {
  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      className="card-surface group overflow-hidden"
    >
      <div className="relative overflow-hidden rounded-[24px]">
        <img
          src={getImageUrl(e.eventImage)}
          alt={e.title}
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">
          {e.status || 'Featured'}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">{e.title}</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <HiCalendarDays className="text-base text-primary" />
            <span>{formatEventDate(e.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <HiMapPin className="text-base text-primary" />
            <span>{e.location || 'Venue to be announced'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Starting at</div>
            <div className="text-2xl font-black tracking-tight text-slate-900">₹{e.ticketPrice ?? 0}</div>
          </div>
          <Link to={`/events/${e._id}`} className="btn-primary">
            <span>Book Ticket</span>
            <HiOutlineArrowRight className="text-base" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
