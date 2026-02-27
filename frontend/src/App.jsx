import { Link, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PropertyDetailsPage from './pages/PropertyDetailsPage'
import NewPropertyPage from './pages/NewPropertyPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>RentNest India</h1>
        <nav>
          <Link to="/">Listings</Link>
          <Link to="/new">Add Property</Link>
          <Link to="/admin">Admin Panel</Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route path="/new" element={<NewPropertyPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
