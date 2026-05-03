import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import InlineError from '../components/feedback/InlineError'
import PageWrapper from '../components/layout/PageWrapper'
import { useAuth } from '../hooks/useAuth'
import extractErrorMessage from '../utils/extractErrorMessage'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const onChange = (event) => {
    const { name, value } = event.target
    if (submitError) {
      setSubmitError('')
    }
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setLoading(true)

    try {
      await register(form)
      toast.success('Account created successfully')
      navigate('/showroom', { replace: true })
    } catch (error) {
      const message = extractErrorMessage(error, 'Registration failed')
      setSubmitError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper className="auth-page-shell">
      <section className="auth-layout">
        <motion.div
          className="auth-poster"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="eyebrow">Get Started</p>
          <h2>Build Your Dream Garage</h2>
          <p>Create an account to unlock booking and personalized showroom experience.</p>
        </motion.div>

        <motion.form
          className="auth-card"
          onSubmit={onSubmit}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h3>Register</h3>
          <label>
            Name
            <input type="text" name="name" value={form.name} onChange={onChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" minLength={6} value={form.password} onChange={onChange} required />
          </label>
          <InlineError message={submitError} />
          <button className="btn solid" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          <p className="switch-line">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </motion.form>
      </section>
    </PageWrapper>
  )
}

export default Register
