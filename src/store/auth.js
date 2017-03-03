import { browserHistory } from 'react-router'
import JWT from 'jwt-client'
import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_REQUEST = 'auth/LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'auth/LOGIN_FAILURE'

export const USER_UPDATE_REQUEST = 'auth/USER_UPDATE_REQUEST'
export const USER_UPDATE_SUCCESS = 'auth/USER_UPDATE_SUCCESS'
export const USER_UPDATE_FAILURE = 'auth/USER_UPDATE_FAILURE'

export const USER_FETCH_REQUEST = 'auth/USER_FETCH_REQUEST'
export const USER_FETCH_SUCCESS = 'auth/USER_FETCH_SUCCESS'
export const USER_FETCH_FAILURE = 'auth/USER_FETCH_FAILURE'

export const TOKEN_REFRESH_REQUEST = 'auth/TOKEN_REFRESH_REQUEST'
export const TOKEN_REFRESH_SUCCESS = 'auth/TOKEN_REFRESH_SUCCESS'
export const TOKEN_REFRESH_FAILURE = 'auth/TOKEN_REFRESH_FAILURE'

export const USER_LOGOUT = 'auth/USER_LOGOUT'

// ------------------------------------
// Actions
// ------------------------------------
export const login = (creds, signup = false) => {
  return (dispatch, getState) => {
    return dispatch({ [CALL_API]: {
      endpoint: !signup ? '/auth/login' : '/auth/signup',
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
  setTimeout(() => browserHistory.push('/login'), 100)
  return {
    type: USER_LOGOUT
  }
}

export const fetchUser = () => {
  return {
    [CALL_API]: {
      endpoint: '/auth/me',
      method: 'GET',
      types: [
        USER_FETCH_REQUEST,
        USER_FETCH_SUCCESS,
        USER_FETCH_FAILURE
      ]
    }
  }
}

export const updateUser = (payload) => {
  return {
    [CALL_API]: {
      endpoint: '/auth/me',
      method: 'PUT',
      body: JSON.stringify(payload),
      types: [
        USER_UPDATE_REQUEST,
        {
          type: USER_UPDATE_SUCCESS,
          payload: (action, state, res) => {
            return res.json().then((update) => {
              const user = {
                ...state.auth.user,
                ...update
              }
              localStorage.setItem('user', JSON.stringify(user))
              return user
            })
          }
        },
        USER_UPDATE_FAILURE
      ]
    }
  }
}

export const refreshToken = () => {
  return (dispatch, state) => dispatch({
    [CALL_API]: {
      endpoint: '/auth/refreshToken',
      method: 'GET',
      types: [
        TOKEN_REFRESH_REQUEST,
        {
          type: LOGIN_SUCCESS,
          payload: (action, state, res) => {
            return res.json().then((json) => {
              const user = {
                ...state.auth.user,
                ...json.payload
              }
              localStorage.setItem('user', JSON.stringify(user))
              localStorage.setItem('token', json.token)
              return {
                user,
                token: json.token
              }
            })
          }
        },
        USER_LOGOUT
      ]
    }
  })
}

export const actions = {
  login,
  logout,
  fetchUser,
  updateUser,
  refreshToken
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
  },
  [USER_UPDATE_REQUEST]: (state, action) => {
    return {
      ...state,
      isSaving: true
    }
  },
  [USER_UPDATE_SUCCESS]: (state, action) => {
    return {
      ...state,
      isSaving: false,
      user: action.payload
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const token = localStorage.getItem('token')
const isAuthenticated = JWT.validate(token)

const initialState = {
  isSaving: false,
  isAuthenticated: isAuthenticated,
  token: isAuthenticated && token,
  user: isAuthenticated && JSON.parse(localStorage.getItem('user'))
}

export default function authReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
