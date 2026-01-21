'use client'

import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from '@/lib/emailjs-config'

// Simple test component to verify EmailJS integration
// Remove this file after testing
const EmailJSTest = () => {
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')

  const testEmailJS = async () => {
    setTestStatus('testing')
    
    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          name: 'Test User',
          email: 'test@example.com',
          phone: 'Test Phone',
          message: 'This is a test message from EmailJS integration.',
          from_name: 'Test User',
          from_email: 'test@example.com',
          to_name: 'Mahdi Hasan',
        },
        EMAILJS_CONFIG.PUBLIC_KEY
      )
      
      console.log('Test email sent:', result)
      setTestStatus('success')
    } catch (error) {
      console.error('Test email failed:', error)
      setTestStatus('error')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 p-4 rounded-lg border border-white/20">
      <h3 className="text-white text-sm mb-2">EmailJS Test</h3>
      <button
        onClick={testEmailJS}
        disabled={testStatus === 'testing'}
        className="px-4 py-2 bg-primary text-black text-xs rounded disabled:opacity-50"
      >
        {testStatus === 'testing' ? 'Testing...' : 'Test EmailJS'}
      </button>
      {testStatus === 'success' && (
        <p className="text-green-400 text-xs mt-2">✓ Test successful!</p>
      )}
      {testStatus === 'error' && (
        <p className="text-red-400 text-xs mt-2">✗ Test failed!</p>
      )}
    </div>
  )
}

export default EmailJSTest