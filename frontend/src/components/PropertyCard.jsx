import { Link } from 'react-router-dom'
import { formatInr } from '../utils/currency'

function PropertyCard({ property, isFavorite, onToggleFavorite }) {
  return (
    <article className="card">
      <img src={property.imageUrl} alt={property.title} className="card-image" />
      <div className="card-body">
        <div className="card-headline">
          <h3>{property.title}</h3>
          <button type="button" className="favorite-btn" onClick={() => onToggleFavorite(property.id)}>
            {isFavorite ? 'Saved' : 'Save'}
          </button>
        </div>
        <p>{property.city} • {property.propertyType || 'Home'}</p>
        <p>{property.bedrooms} bed • {property.bathrooms} bath • {property.furnished ? 'Furnished' : 'Unfurnished'}</p>
        <p className="chips">{(property.amenities || []).slice(0, 2).join(' • ')}</p>
        <strong>{formatInr(property.monthlyRent)}/month</strong>
        <Link to={`/properties/${property.id}`} className="btn btn-outline">View Details</Link>
      </div>
    </article>
  )
}

export default PropertyCard
