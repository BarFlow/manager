import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const VENUE_FETCH_REQUEST = 'VENUE_FETCH_REQUEST'
export const VENUE_FETCH_SUCCESS = 'VENUE_FETCH_SUCCESS'
export const VENUE_FETCH_FAILURE = 'VENUE_FETCH_FAILURE'

export const VENUE_CURRENT_CHANGE = 'VENUE_CURRENT_CHANGE'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchVenues = () => {
  return {
    [CALL_API]: {
      endpoint: '/venues',
      method: 'GET',
      types: [
        VENUE_FETCH_REQUEST,
        VENUE_FETCH_SUCCESS,
        VENUE_FETCH_FAILURE
      ]
    }
  }
}

export const changeCurrentVenue = (newId) => {
  return {
    type: VENUE_CURRENT_CHANGE,
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
  [VENUE_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true
    }
  },
  [VENUE_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      items: action.payload,
      current: state.current || action.payload[0]._id
    }
  },
  [VENUE_CURRENT_CHANGE] : (state, action) => {
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
