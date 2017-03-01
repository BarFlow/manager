import { logout } from '../auth'

export default store => next => action => {
  // Log out user if token is not valid (401 - Unauthorized)
  if (action.type !== 'auth/LOGIN_FAILURE' && action.payload && action.error && action.payload.status === 401) {
    return next(logout())
  }

  // Pass the FSA to the next action.
  return next(action)
}
