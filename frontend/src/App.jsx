import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import HomePage from './pages/HomePage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import NewPropertyPage from './pages/NewPropertyPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import { getCurrentSession, logoutUser } from './auth/session'

function App() {
  const navigate = useNavigate()
  const [session, setSession] = useState(() => getCurrentSession())
  const isAdmin = useMemo(() => session?.role === 'ADMIN', [session])

  function handleLogout() {
    logoutUser()
    setSession(null)
    navigate('/login')
  }

  function refreshSession() {
    setSession(getCurrentSession())
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>RentNest India</h1>
        <nav>
          <Link to="/">Listings</Link>
          {!session && <Link to="/login">Login</Link>}
          {!session && <Link to="/register">Register</Link>}
          {isAdmin && <Link to="/new">Add Property</Link>}
          {isAdmin && <Link to="/admin">Admin Panel</Link>}
          {session && <button className="link-button" onClick={handleLogout}>Logout</button>}
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/login" element={<LoginPage onLogin={refreshSession} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/new" element={<ProtectedRoute requireAdmin><NewPropertyPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
