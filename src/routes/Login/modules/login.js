import { CALL_API } from 'redux-api-middleware'
import { browserHistory } from 'react-router'

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

export const userLogin = (creds) => {
  return (dispatch, getState) => {
    dispatch({ [CALL_API]: {
      endpoint: 'https://api.stockmate.co.uk/auth/login',
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
      browserHistory.push(getState().location.query.next || '/')
    })
  }
}

export const actions = {
  userLogin
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true
    }
  },
  [LOGIN_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      errorMessage: undefined
    }
  },
  [LOGIN_FAILURE] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      errorMessage: action.message
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false
}
export default function authReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
