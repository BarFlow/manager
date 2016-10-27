import { browserHistory } from 'react-router'

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGOUT = 'LOGOUT'

// ------------------------------------
// Actions
// ------------------------------------
export function logout () {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  browserHistory.push('/login')
  return {
    type: LOGOUT
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_SUCCESS] : (state, action) => {
    return {
      ...state,
      token: action.payload.token,
      user: action.payload.user
    }
  },
  [LOGOUT] : (state, action) => {
    return {
      ...state,
      isAuthenticated: false,
      token: null,
      user: null
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')) || null
}
export default function authReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
