import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../auth/session'
import { isValidEmail, isValidIndianPhone } from '../utils/validators'

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password must match.')
      return
    }
    if (!isValidEmail(form.email)) {
      setError('Please enter a valid email address.')
      return
    }
    if (!isValidIndianPhone(form.phone)) {
      setError('Please enter a valid Indian phone number.')
      return
    }

    try {
      registerUser(form)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="auth-wrap">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <p>Create your tenant account.</p>
        <input
          required
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          required
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          type="tel"
          placeholder="Phone (e.g. 9876543210)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          required
          type="password"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
        <button className="btn" type="submit">Register</button>
        {error && <p className="error">{error}</p>}
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </section>
  )
}

export default RegisterPage
