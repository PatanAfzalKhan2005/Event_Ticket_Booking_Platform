import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiArrowRightOnRectangle, HiOutlineSquares2X2, HiOutlineTicket, HiOutlineUserCircle } from 'react-icons/hi2'
import { useAuthStore } from '../stores/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const nav = useNavigate()
  const location = useLocation()
  const isDashboardProfile = location.pathname === '/dashboard' && location.search.includes('section=profile')

  const links = user
    ? [
        { to: '/events', label: 'Events', icon: <HiOutlineTicket className="text-base" /> },
        { to: '/dashboard', label: 'Dashboard', icon: <HiOutlineSquares2X2 className="text-base" /> },
        { to: '/dashboard?section=profile', label: 'Profile', icon: <HiOutlineUserCircle className="text-base" /> }
      ]
    : [
        { to: '/login', label: 'Login' },
        { to: '/register', label: 'Register' }
      ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to={user ? '/home' : '/'} className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-lg font-black text-white shadow-purple">
            ES
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900">EventSphere</div>
            <div className="text-xs font-medium uppercase tracking-[0.24em] text-slate-500">Events. Tickets. Momentum.</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          {links.map((link) => {
            const active = location.pathname === link.to || (link.label === 'Profile' && isDashboardProfile)

            return (
              <Link key={link.label} to={link.to} className={`nav-pill ${active ? 'nav-pill-active' : ''}`}>
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )
          })}

          {user ? (
            <>
              <span className="hidden rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-slate-700 md:inline-flex">
                {user.name}
              </span>
              <button
                onClick={() => {
                  logout()
                  nav('/login')
                }}
                className="btn-secondary"
              >
                <HiArrowRightOnRectangle className="text-base" />
                <span>Logout</span>
              </button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
