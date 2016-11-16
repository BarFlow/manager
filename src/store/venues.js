import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const VENUES_FETCH_REQUEST = 'VENUES_FETCH_REQUEST'
export const VENUES_FETCH_SUCCESS = 'VENUES_FETCH_SUCCESS'
export const VENUES_FETCH_FAILURE = 'VENUES_FETCH_FAILURE'

export const VENUES_CURRENT_CHANGE = 'VENUES_CURRENT_CHANGE'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchVenues = () => {
  return {
    [CALL_API]: {
      endpoint: '/venues',
      method: 'GET',
      types: [
        VENUES_FETCH_REQUEST,
        VENUES_FETCH_SUCCESS,
        VENUES_FETCH_FAILURE
      ]
    }
  }
}

export const changeCurrentVenue = (newId) => {
  return {
    type: VENUES_CURRENT_CHANGE,
    payload: newId
  }
}

export const actions = {
  fetchVenues,
  changeCurrentVenue
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [VENUES_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true
    }
  },
  [VENUES_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      items: action.payload,
      current: state.current || action.payload[0]._id
    }
  },
  [VENUES_CURRENT_CHANGE] : (state, action) => {
    return {
      ...state,
      current: action.payload
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false,
  items: [],
  current: null
}
export default function venueReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
