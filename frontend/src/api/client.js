const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Admin@123'

function adminAuthHeader() {
  const token = btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`)
  return { Authorization: `Basic ${token}` }
}

function toQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, value)
    }
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const api = {
  getProperties: (filters = {}) => request(`/properties${toQuery(filters)}`),
  getPropertyById: (id) => request(`/properties/${id}`),
  createProperty: (payload) => request('/properties', { method: 'POST', headers: adminAuthHeader(), body: JSON.stringify(payload) }),
  updatePropertyAvailability: (id, available) => request(`/properties/${id}/availability${toQuery({ available })}`, { method: 'PATCH', headers: adminAuthHeader() }),
  deleteProperty: (id) => request(`/properties/${id}`, { method: 'DELETE', headers: adminAuthHeader() }),
  createRentalRequest: (payload) => request('/rental-requests', { method: 'POST', body: JSON.stringify(payload) }),
  getRentalRequests: (status) => request(`/rental-requests${toQuery({ status })}`, { headers: adminAuthHeader() }),
  updateRentalRequestStatus: (id, status) => request(`/rental-requests/${id}/status${toQuery({ status })}`, { method: 'PATCH', headers: adminAuthHeader() }),
  getAdminChanges: () => request('/admin/changes', { headers: adminAuthHeader() }),
  rollbackAdminChange: (changeId) => request(`/admin/rollback/${changeId}`, { method: 'POST', headers: adminAuthHeader() })
}
