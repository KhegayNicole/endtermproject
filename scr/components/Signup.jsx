import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { Spinner } from './Spinner.jsx'
import './Login.css'

export function Signup() {
  const navigate = useNavigate()
  const { user, isLoading, signup, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/profile', { replace: true })
    }
  }, [user, isLoading, navigate])

  const handleSubmit = (event) => {
    event.preventDefault()
    setFormError('')

    signup({ email, password, confirmPassword })
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
        <h1>Create an account</h1>
        <p className="auth-subtitle">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            aria-describedby="password-rules"
          />
          <p id="password-rules" className="password-rules">
            8+ chars, 1 number, 1 special character
          </p>

          <label htmlFor="signup-confirm-password">Confirm password</label>
          <input
            id="signup-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
          />

          {errorMessage && <p className="auth-error">{errorMessage}</p>}

          <button className="auth-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  )
}


