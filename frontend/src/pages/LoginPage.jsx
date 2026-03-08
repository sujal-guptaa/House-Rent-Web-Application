import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../auth/session'

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ identifier: '', password: '' })
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      const session = loginUser(form.identifier, form.password)
      onLogin?.()
      const fallback = session.role === 'ADMIN' ? '/admin' : '/'
      navigate(location.state?.from || fallback, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="auth-wrap">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <p>Use your username/email and password.</p>
        <input
          required
          placeholder="Email or Username"
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="btn" type="submit">Login</button>
        {error && <p className="error">{error}</p>}
        <p>New user? <Link to="/register">Create account</Link></p>
      </form>
    </section>
  )
}

export default LoginPage
