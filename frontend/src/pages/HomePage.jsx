import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import PropertyCard from '../components/PropertyCard'

function HomePage() {
  const [properties, setProperties] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorite_properties') || '[]')
    } catch {
      return []
    }
  })
  const [filters, setFilters] = useState({
    city: '',
    minRent: '',
    maxRent: '',
    minBedrooms: '',
    availableOnly: true,
    propertyType: '',
    furnishedOnly: false,
    sortBy: 'latest'
  })

  async function loadProperties(currentFilters = filters) {
    try {
      setLoading(true)
      setError('')
      const data = await api.getProperties({
        city: currentFilters.city,
        minRent: currentFilters.minRent,
        maxRent: currentFilters.maxRent,
        minBedrooms: currentFilters.minBedrooms,
        availableOnly: currentFilters.availableOnly,
        propertyType: currentFilters.propertyType,
        furnishedOnly: currentFilters.furnishedOnly,
        sortBy: currentFilters.sortBy
      })
      setProperties(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProperties()
    api.getCities().then(setCities).catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem('favorite_properties', JSON.stringify(favorites))
  }, [favorites])

  function handleSearch(event) {
    event.preventDefault()
    loadProperties(filters)
  }

  function toggleFavorite(propertyId) {
    setFavorites((prev) => prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId])
  }

  function clearFilters() {
    const reset = {
      city: '',
      minRent: '',
      maxRent: '',
      minBedrooms: '',
      availableOnly: true,
      propertyType: '',
      furnishedOnly: false,
      sortBy: 'latest'
    }
    setFilters(reset)
    loadProperties(reset)
  }

  const favoriteCount = useMemo(() => favorites.length, [favorites])

  return (
    <section>
      <div className="meta-bar">
        <h2>Find your next home</h2>
        <p>Saved homes: <strong>{favoriteCount}</strong></p>
      </div>

      <form onSubmit={handleSearch} className="filters-grid">
        <select
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        >
          <option value="">All Cities</option>
          {cities.map((city) => <option key={city} value={city}>{city}</option>)}
        </select>
        <input
          type="number"
          min="0"
          placeholder="Min Rent (INR)"
          value={filters.minRent}
          onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
        />
        <input
          type="number"
          min="0"
          placeholder="Max Rent (INR)"
          value={filters.maxRent}
          onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
        />
        <input
          type="number"
          min="1"
          placeholder="Min Bedrooms"
          value={filters.minBedrooms}
          onChange={(e) => setFilters({ ...filters, minBedrooms: e.target.value })}
        />
        <select
          value={filters.propertyType}
          onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
        >
          <option value="">All Property Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Studio">Studio</option>
          <option value="Duplex">Duplex</option>
          <option value="Shared Flat">Shared Flat</option>
        </select>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="latest">Latest</option>
          <option value="rent_asc">Rent: Low to High</option>
          <option value="rent_desc">Rent: High to Low</option>
          <option value="bedrooms_desc">Bedrooms: High to Low</option>
        </select>
        <label className="inline-check">
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
          />
          Available only
        </label>
        <label className="inline-check">
          <input
            type="checkbox"
            checked={filters.furnishedOnly}
            onChange={(e) => setFilters({ ...filters, furnishedOnly: e.target.checked })}
          />
          Furnished only
        </label>
        <div className="filter-actions">
          <button type="submit" className="btn">Apply Filters</button>
          <button type="button" className="btn btn-light" onClick={clearFilters}>Clear</button>
        </div>
      </form>

      {loading && <p>Loading properties...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && <p>Showing {properties.length} homes</p>}

      <div className="grid">
        {!loading && !error && properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isFavorite={favorites.includes(property.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  )
}

export default HomePage
