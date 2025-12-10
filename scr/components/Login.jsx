import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { Spinner } from './Spinner.jsx'
import './Login.css'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoading, login, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const redirectTo = location.state?.from?.pathname ?? '/profile'

  useEffect(() => {
    if (!isLoading && user) {
      navigate(redirectTo, { replace: true })
    }
  }, [user, isLoading, navigate, redirectTo])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    login({ email, password })
      .unwrap()
      .catch((err) => setFormError(err))
  }

  if (isLoading) {
    return <Spinner />
  }

  const errorMessage = formError || authError

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">
          Need an account?{' '}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}

