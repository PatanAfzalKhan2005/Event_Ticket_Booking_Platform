import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Loading from './components/Loading'
import { useAuthStore } from './stores/authStore'

const Home = lazy(() => import('./pages/Home'))
const Events = lazy(() => import('./pages/Events'))
const EventDetails = lazy(() => import('./pages/EventDetails'))
const SeatBooking = lazy(() => import('./pages/SeatBooking'))
const MyBookings = lazy(() => import('./pages/MyBookings'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

function ProtectedRoute({ children }) {
  const { user, hydrated } = useAuthStore()

  if (!hydrated) return <Loading />
  if (!user) return <Navigate to="/login" replace />

  return children
}

function PublicOnlyRoute({ children }) {
  const { user, hydrated } = useAuthStore()

  if (!hydrated) return <Loading />
  if (user) return <Navigate to="/home" replace />

  return children
}

export default function App() {
  const { init } = useAuthStore()

  React.useEffect(() => {
    init()
  }, [init])

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
          <Route path="/seat-booking" element={<ProtectedRoute><SeatBooking /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}
