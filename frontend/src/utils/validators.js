const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INDIAN_PHONE_REGEX = /^(?:\+91[- ]?)?[6-9]\d{9}$/

export function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email || '').trim())
}

export function isValidIndianPhone(phone) {
  return INDIAN_PHONE_REGEX.test(String(phone || '').trim())
}
