import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/client'
import { formatInr } from '../utils/currency'

function PropertyDetailsPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [form, setForm] = useState({
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    preferredMoveInDate: '',
    message: ''
  })
  const [status, setStatus] = useState('')

  useEffect(() => {
    api.getPropertyById(id).then(setProperty).catch((err) => setStatus(err.message))
  }, [id])

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('Submitting...')

    try {
      await api.createRentalRequest({
        propertyId: id,
        tenantName: form.tenantName,
        tenantEmail: form.tenantEmail,
        tenantPhone: form.tenantPhone,
        preferredMoveInDate: form.preferredMoveInDate,
        message: form.message
      })
      setStatus('Rental request submitted.')
      setForm({ tenantName: '', tenantEmail: '', tenantPhone: '', preferredMoveInDate: '', message: '' })
    } catch (err) {
      setStatus(`Failed: ${err.message}`)
    }
  }

  if (!property) {
    return <p>{status || 'Loading property...'}</p>
  }

  return (
    <section className="details-layout">
      <img src={property.imageUrl} alt={property.title} className="details-image" />
      <div>
        <h2>{property.title}</h2>
        <p>{property.description}</p>
        <p><strong>Address:</strong> {property.address}, {property.city}</p>
        <p><strong>Type:</strong> {property.propertyType} • {property.furnished ? 'Furnished' : 'Unfurnished'}</p>
        <p><strong>Listed By:</strong> {property.listedBy}</p>
        <p><strong>Rent:</strong> {formatInr(property.monthlyRent)}/month</p>
        <p><strong>Rooms:</strong> {property.bedrooms} bed, {property.bathrooms} bath</p>
        <p><strong>Amenities:</strong> {(property.amenities || []).join(', ')}</p>

        <form onSubmit={handleSubmit} className="request-form">
          <h3>Request This Property</h3>
          <input
            required
            type="text"
            placeholder="Your name"
            value={form.tenantName}
            onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Your email"
            value={form.tenantEmail}
            onChange={(e) => setForm({ ...form, tenantEmail: e.target.value })}
          />
          <input
            required
            type="tel"
            placeholder="Your phone"
            value={form.tenantPhone}
            onChange={(e) => setForm({ ...form, tenantPhone: e.target.value })}
          />
          <input
            required
            type="date"
            value={form.preferredMoveInDate}
            onChange={(e) => setForm({ ...form, preferredMoveInDate: e.target.value })}
          />
          <textarea
            required
            rows="4"
            placeholder="Tell the owner about your move-in plan"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button className="btn" type="submit">Send Request</button>
          {status && <p>{status}</p>}
        </form>
      </div>
    </section>
  )
}

export default PropertyDetailsPage
