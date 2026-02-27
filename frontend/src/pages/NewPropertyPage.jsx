import { useState } from 'react'
import { api } from '../api/client'

function NewPropertyPage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    city: '',
    address: '',
    monthlyRent: '',
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: '',
    propertyType: 'Apartment',
    furnished: true,
    listedBy: '',
    amenities: '',
    available: true
  })
  const [status, setStatus] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('Saving...')

    try {
      await api.createProperty({
        ...form,
        monthlyRent: Number(form.monthlyRent),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        amenities: form.amenities
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
      })
      setStatus('Property added successfully.')
      setForm({
        title: '',
        description: '',
        city: '',
        address: '',
        monthlyRent: '',
        bedrooms: 1,
        bathrooms: 1,
        imageUrl: '',
        propertyType: 'Apartment',
        furnished: true,
        listedBy: '',
        amenities: '',
        available: true
      })
    } catch (err) {
      setStatus(`Failed: ${err.message}`)
    }
  }

  return (
    <section>
      <h2>Add New Property</h2>
      <form className="request-form" onSubmit={handleSubmit}>
        <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea required rows="4" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input required placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input required placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <input required type="number" min="1" placeholder="Monthly Rent (INR)" value={form.monthlyRent} onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })} />
        <input required type="number" min="1" placeholder="Bedrooms" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
        <input required type="number" min="1" placeholder="Bathrooms" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
        <input required placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Studio</option>
          <option>Duplex</option>
          <option>Shared Flat</option>
        </select>
        <input required placeholder="Listed By (Agency/Owner name)" value={form.listedBy} onChange={(e) => setForm({ ...form, listedBy: e.target.value })} />
        <input placeholder="Amenities (comma separated)" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
        <label className="inline-check">
          <input type="checkbox" checked={form.furnished} onChange={(e) => setForm({ ...form, furnished: e.target.checked })} />
          Furnished
        </label>
        <button className="btn" type="submit">Create Property</button>
        {status && <p>{status}</p>}
      </form>
    </section>
  )
}

export default NewPropertyPage
