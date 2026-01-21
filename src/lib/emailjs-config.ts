// EmailJS Configuration
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_34a77ag',
  TEMPLATE_ID: 'template_574n4jj',
  PUBLIC_KEY: '75nfGEHYNiCj4bswi',
} as const

// Template variable mapping for EmailJS
export const EMAIL_TEMPLATE_VARS = {
  NAME: 'name',
  EMAIL: 'email', 
  PHONE: 'phone',
  MESSAGE: 'message',
  FROM_NAME: 'from_name',
  FROM_EMAIL: 'from_email',
  TO_NAME: 'to_name',
} as const