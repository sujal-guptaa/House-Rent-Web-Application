import { isValidEmail, isValidIndianPhone } from '../utils/validators'
const USERS_KEY = 'rentnest_users'
const SESSION_KEY = 'rentnest_session'

function defaultUsers() {
  return [
    {
      fullName: 'System Admin',
      username: 'admin',
      email: 'admin@rentnest.in',
      phone: '9876543210',
      password: 'Admin@123',
      role: 'ADMIN'
    }
  ]
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers()))
      return defaultUsers()
    }
    return JSON.parse(raw)
  } catch {
    return defaultUsers()
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function registerUser(payload) {
  const users = readUsers()
  const email = payload.email.trim().toLowerCase()
  const username = payload.username.trim().toLowerCase()
  const phone = payload.phone.trim()

  if (!isValidEmail(email)) {
    throw new Error('Please enter a valid email address.')
  }
  if (!isValidIndianPhone(phone)) {
    throw new Error('Please enter a valid Indian phone number.')
  }

  const exists = users.some((user) => user.email === email || user.username === username)
  if (exists) {
    throw new Error('User with same email or username already exists.')
  }

  const user = {
    fullName: payload.fullName.trim(),
    username,
    email,
    phone,
    password: payload.password,
    role: 'USER'
  }

  users.push(user)
  saveUsers(users)
  return user
}

export function loginUser(identifier, password) {
  const users = readUsers()
  const normalized = identifier.trim().toLowerCase()

  const user = users.find((entry) =>
    (entry.email === normalized || entry.username === normalized) && entry.password === password
  )

  if (!user) {
    throw new Error('Invalid email/username or password.')
  }

  const session = {
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    role: user.role
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isAdminSession() {
  const session = getCurrentSession()
  return session?.role === 'ADMIN'
}

export function getAdminCredentials() {
  const session = getCurrentSession()
  if (!session || session.role !== 'ADMIN') {
    return null
  }
  const users = readUsers()
  const admin = users.find((user) => user.username === session.username && user.role === 'ADMIN')
  return admin ? { username: admin.username, password: admin.password } : null
}
