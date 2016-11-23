import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const TYPES_FETCH_REQUEST = 'types/FETCH_REQUEST'
export const TYPES_FETCH_SUCCESS = 'types/FETCH_SUCCESS'
export const TYPES_FETCH_FAILURE = 'types/FETCH_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchTypes = () => {
  return {
    [CALL_API]: {
      endpoint: '/types',
      method: 'GET',
      types: [
        TYPES_FETCH_REQUEST,
        TYPES_FETCH_SUCCESS,
        TYPES_FETCH_FAILURE
      ]
    }
  }
}

export const actions = {
  fetchTypes
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [TYPES_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true
    }
  },
  [TYPES_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      items: action.payload
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false,
  items: []
}
export default function venueReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
