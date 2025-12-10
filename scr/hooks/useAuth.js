import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, logoutUser, signupUser } from '../features/auth/authSlice.js'

export function useAuth() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const status = useSelector((state) => state.auth.status)
  const error = useSelector((state) => state.auth.error)

  const signup = useCallback(
    (payload) => {
      return dispatch(signupUser(payload))
    },
    [dispatch],
  )

  const login = useCallback(
    (payload) => {
      return dispatch(loginUser(payload))
    },
    [dispatch],
  )

  const logout = useCallback(() => {
    return dispatch(logoutUser())
  }, [dispatch])

  return {
    user,
    status,
    error,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading: status === 'loading',
  }
}

