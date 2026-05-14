import { Bell, CircleUserRound, Menu, Moon, QrCode, Sun, Ticket, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { useTheme } from './components/ThemeProvider'
import { AdminCreateEventPage } from './pages/AdminCreateEventPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { AdminLayout } from './pages/AdminLayout'
import { AuthPage } from './pages/AuthPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { DiscoveryPage } from './pages/DiscoveryPage'
import { EventDetailPage } from './pages/EventDetailPage'
import { ForbiddenPage } from './pages/ForbiddenPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { MyTicketsPage } from './pages/MyTicketsPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ProfilePage } from './pages/ProfilePage'
import { SeatMapDesignerPage } from './pages/SeatMapDesignerPage'
import { SeatSelectionPage } from './pages/SeatSelectionPage'
import { SoundSearchPage } from './pages/SoundSearchPage'
import { UserManagementPage } from './pages/UserManagementPage'
import { WaitingRoomPage } from './pages/WaitingRoomPage'
import { ScrollToTop } from './components/ScrollToTop'
// App router v3 - dark mode + mobile nav + theme toggle

function App() {
  const auth = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  if (isAdminRoute) {
    return (
      <Routes>
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="events/new" element={<AdminCreateEventPage />} />
          <Route path="events/:eventId/edit" element={<AdminCreateEventPage />} />
          <Route path="events/new/seat-map" element={<SeatMapDesignerPage />} />
          <Route path="users" element={<UserManagementPage />} />
        </Route>
      </Routes>
    )
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <NavLink className="brand-mark" to="/" aria-label="TicketRush home">
          <span>
            <Ticket size={18} strokeWidth={2.5} />
          </span>
          TicketRush
        </NavLink>

        <nav className="site-nav desktop-nav" aria-label="Primary navigation">
          <NavLink to="/">Explore</NavLink>
          {auth.isAuthenticated ? (
            <>
              <NavLink to="/tickets">
                <QrCode size={18} strokeWidth={2.5} />
                My Tickets
              </NavLink>
              <NavLink to="/notifications" aria-label="Notifications">
                <Bell size={18} strokeWidth={2.5} />
                Notifications
              </NavLink>
              <NavLink className="user-nav-link" to="/profile">
                {auth.user?.avatar_url ? <img src={auth.user.avatar_url} alt="" /> : <CircleUserRound size={18} strokeWidth={2.5} />}
                <span>{auth.user?.full_name ?? 'Profile'}</span>
              </NavLink>
            </>
          ) : (
            <NavLink to="/login">Sign in</NavLink>
          )}
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
          </button>
        </nav>

        <div className="mobile-nav-controls">
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
          </button>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-expanded={mobileNavOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileNavOpen((v) => !v)}
          >
            {mobileNavOpen ? <X size={20} strokeWidth={2.5} /> : <Menu size={20} strokeWidth={2.5} />}
          </button>
        </div>
      </header>

      {mobileNavOpen && (
        <nav className="mobile-nav-drawer" aria-label="Mobile navigation">
          <NavLink to="/" onClick={() => setMobileNavOpen(false)}>Explore</NavLink>
          {auth.isAuthenticated ? (
            <>
              <NavLink to="/tickets" onClick={() => setMobileNavOpen(false)}>
                <QrCode size={18} strokeWidth={2.5} /> My Tickets
              </NavLink>
              <NavLink to="/notifications" onClick={() => setMobileNavOpen(false)}>
                <Bell size={18} strokeWidth={2.5} /> Notifications
              </NavLink>
              <NavLink to="/profile" onClick={() => setMobileNavOpen(false)}>
                <CircleUserRound size={18} strokeWidth={2.5} />
                <span>{auth.user?.full_name ?? 'Profile'}</span>
              </NavLink>
            </>
          ) : (
            <NavLink to="/login" onClick={() => setMobileNavOpen(false)}>Sign in</NavLink>
          )}
        </nav>
      )}

      <Routes>
        <Route path="/" element={<DiscoveryPage />} />
        <Route path="/sound-search" element={<SoundSearchPage />} />
        <Route path="/events/:eventId" element={<EventDetailPage />} />
        <Route path="/queue/:showtimeId" element={<WaitingRoomPage />} />
        <Route path="/showtimes/:showtimeId/seats" element={<SeatSelectionPage />} />
        <Route path="/checkout/:bookingId" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
        <Route path="/tickets" element={<RequireAuth><MyTicketsPage /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback/google" element={<AuthPage initialMode="login" />} />
        <Route path="/auth/callback/facebook" element={<AuthPage initialMode="login" />} />
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
      <ScrollToTop />
    </main>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.isLoading) {
    return <RouteLoading />
  }

  if (!auth.isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`} replace />
  }

  return children
}

function RequireAdmin({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const location = useLocation()

  if (auth.isLoading) {
    return <RouteLoading />
  }

  if (!auth.isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(`${location.pathname}${location.search}`)}`} replace />
  }

  if (!auth.isAdmin) {
    return <Navigate to="/403" replace />
  }

  return children
}

function RouteLoading() {
  return (
    <section className="state-page">
      <div className="state-block">
        <h1>Loading workspace</h1>
        <p>TicketRush is checking your session.</p>
        <Link className="secondary-button compact-button" to="/">
          Back to Explore
        </Link>
      </div>
    </section>
  )
}

export default App
