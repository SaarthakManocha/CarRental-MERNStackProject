import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import InlineError from '../components/feedback/InlineError'
import PageWrapper from '../components/layout/PageWrapper'
import { useAuth } from '../hooks/useAuth'
import extractErrorMessage from '../utils/extractErrorMessage'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const from = location.state?.from || '/showroom'

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
      await login(form)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (error) {
      const message = extractErrorMessage(error, 'Login failed')
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
          <p className="eyebrow">Member Access</p>
          <h2>Unlock Your Garage</h2>
          <p>Sign in to manage bookings, save favorites, and access premium inventory.</p>
        </motion.div>

        <motion.form
          className="auth-card"
          onSubmit={onSubmit}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <h3>Login</h3>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={onChange} required />
          </label>
          <InlineError message={submitError} />
          <button className="btn solid" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="switch-line">
            New here? <Link to="/register">Create account</Link>
          </p>
        </motion.form>
      </section>
    </PageWrapper>
  )
}

export default Login
