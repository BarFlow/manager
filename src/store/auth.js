import { browserHistory } from 'react-router'
import JWT from 'jwt-client'
import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'
export const USER_LOGOUT = 'USER_LOGOUT'

// ------------------------------------
// Actions
// ------------------------------------
export const login = (creds) => {
  return (dispatch, getState) => {
    return dispatch({ [CALL_API]: {
      endpoint: '/auth/login',
      method: 'POST',
      body: JSON.stringify(creds),
      types: [
        LOGIN_REQUEST,
        {
          type: LOGIN_SUCCESS,
          payload: (action, state, res) => {
            const contentType = res.headers.get('Content-Type')
            if (contentType && ~contentType.indexOf('json')) {
              // Just making sure res.json() does not raise an error
              return res.json().then((json) => {
                // Extend user data with token claim
                json.user = {
                  ...json.user,
                  ...JWT.read(json.token).claim
                }

                // Store token and user
                localStorage.setItem('token', json.token)
                localStorage.setItem('user', JSON.stringify(json.user))

                // return payload
                return json
              })
            }
          }
        },
        LOGIN_FAILURE
      ]
    } })
    .then(response => {
      if (!response.error) {
        const redirectTo = getState().location ? getState().location.query.next || '/' : '/'
        browserHistory.push(redirectTo)
      }
      return response
    })
  }
}

export function logout () {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  browserHistory.push('/login')
  return {
    type: USER_LOGOUT
  }
}

export const actions = {
  login,
  logout
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_SUCCESS] : (state, action) => {
    return {
      ...state,
      isAuthenticated: true,
      token: action.payload.token,
      user: action.payload.user
    }
  },
  [USER_LOGOUT] : (state, action) => {
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
const token = localStorage.getItem('token')
const isAuthenticated = JWT.validate(token)

const initialState = {
  isAuthenticated: isAuthenticated,
  token: isAuthenticated && token,
  user: isAuthenticated && JSON.parse(localStorage.getItem('user'))
}

export default function authReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
