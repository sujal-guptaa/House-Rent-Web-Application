import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { formatInr } from '../utils/currency'

function AdminPage() {
  const [properties, setProperties] = useState([])
  const [requests, setRequests] = useState([])
  const [changes, setChanges] = useState([])
  const [status, setStatus] = useState('')
  const [requestStatusFilter, setRequestStatusFilter] = useState('')

  async function loadData(filter = requestStatusFilter) {
    try {
      setStatus('Loading admin data...')
      const [propertyData, requestData] = await Promise.all([
        api.getProperties({}),
        api.getRentalRequests(filter)
      ])
      setProperties(propertyData)
      setRequests(requestData)
      setChanges(await api.getAdminChanges())
      setStatus('')
    } catch (err) {
      setStatus(`Failed: ${err.message}`)
    }
  }

  async function handleRollback(changeId) {
    try {
      setStatus('Rolling back change...')
      await api.rollbackAdminChange(changeId)
      await loadData(requestStatusFilter)
      setStatus('Rollback completed.')
    } catch (err) {
      setStatus(`Failed: ${err.message}`)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleToggleAvailability(property) {
    try {
      await api.updatePropertyAvailability(property.id, !property.available)
      await loadData()
    } catch (err) {
      setStatus(`Failed: ${err.message}`)
    }
  }

  async function handleDeleteProperty(id) {
    if (!window.confirm('Delete this property?')) {
      return
    }

    try {
      await api.deleteProperty(id)
      await loadData()
    } catch (err) {
      setStatus(`Failed: ${err.message}`)
    }
  }

  async function handleUpdateRequestStatus(id, newStatus) {
    try {
      await api.updateRentalRequestStatus(id, newStatus)
      await loadData(requestStatusFilter)
    } catch (err) {
      setStatus(`Failed: ${err.message}`)
    }
  }

  const dashboardStats = useMemo(() => {
    const total = properties.length
    const available = properties.filter((property) => property.available).length
    const pending = requests.filter((request) => request.status === 'PENDING').length
    return { total, available, pending }
  }, [properties, requests])

  return (
    <section>
      <div className="meta-bar">
        <h2>Admin Panel</h2>
        <button className="btn" onClick={() => loadData(requestStatusFilter)}>Refresh</button>
      </div>

      <div className="stats-grid">
        <article className="stat-card"><h3>{dashboardStats.total}</h3><p>Total Properties</p></article>
        <article className="stat-card"><h3>{dashboardStats.available}</h3><p>Available Properties</p></article>
        <article className="stat-card"><h3>{dashboardStats.pending}</h3><p>Pending Requests</p></article>
      </div>

      {status && <p>{status}</p>}

      <h3>Manage Properties</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>City</th>
              <th>Rent</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>{property.title}</td>
                <td>{property.city}</td>
                <td>{formatInr(property.monthlyRent)}</td>
                <td>{property.available ? 'Available' : 'Not Available'}</td>
                <td>
                  <button className="btn btn-small" onClick={() => handleToggleAvailability(property)}>
                    {property.available ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                  <button className="btn btn-small btn-danger" onClick={() => handleDeleteProperty(property.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="meta-bar">
        <h3>Manage Rental Requests</h3>
        <select
          value={requestStatusFilter}
          onChange={(e) => {
            const value = e.target.value
            setRequestStatusFilter(value)
            loadData(value)
          }}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Move-In</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.tenantName}</td>
                <td>{request.tenantEmail}</td>
                <td>{request.tenantPhone}</td>
                <td>{request.preferredMoveInDate || 'N/A'}</td>
                <td>
                  <select value={request.status} onChange={(e) => handleUpdateRequestStatus(request.id, e.target.value)}>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Recent Admin Changes (Rollback)</h3>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Entity</th>
              <th>Time</th>
              <th>Status</th>
              <th>Rollback</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change) => (
              <tr key={change.id}>
                <td>{change.action}</td>
                <td>{change.entityType} ({change.entityId})</td>
                <td>{change.createdAt ? new Date(change.createdAt).toLocaleString() : 'N/A'}</td>
                <td>{change.rolledBack ? 'Rolled Back' : 'Active'}</td>
                <td>
                  <button
                    className="btn btn-small"
                    disabled={change.rolledBack}
                    onClick={() => handleRollback(change.id)}
                  >
                    {change.rolledBack ? 'Done' : 'Rollback'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminPage
