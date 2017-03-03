import { CALL_API } from 'redux-api-middleware'
import { refreshToken } from './auth'

// ------------------------------------
// Constants
// ------------------------------------
export const VENUES_FETCH_REQUEST = 'venues/FETCH_REQUEST'
export const VENUES_FETCH_SUCCESS = 'venues/FETCH_SUCCESS'
export const VENUES_FETCH_FAILURE = 'venues/FETCH_FAILURE'

export const VENUES_ADD_REQUEST = 'venues/ADD_REQUEST'
export const VENUES_ADD_SUCCESS = 'venues/ADD_SUCCESS'
export const VENUES_ADD_FAILURE = 'venues/ADD_FAILURE'

export const VENUES_UPDATE_REQUEST = 'venues/UPDATE_REQUEST'
export const VENUES_UPDATE_SUCCESS = 'venues/UPDATE_SUCCESS'
export const VENUES_UPDATE_FAILURE = 'venues/UPDATE_FAILURE'

export const VENUES_CURRENT_CHANGE = 'venues/CURRENT_CHANGE'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchVenues = () => {
  return (dispatch) => dispatch({
    [CALL_API]: {
      endpoint: '/venues',
      method: 'GET',
      types: [
        VENUES_FETCH_REQUEST,
        VENUES_FETCH_SUCCESS,
        VENUES_FETCH_FAILURE
      ]
    }
  }).then(() => dispatch(refreshToken()))
}

export const addVenue = (payload) => {
  return (dispatch) => dispatch({
    [CALL_API]: {
      endpoint: '/venues',
      method: 'POST',
      body: JSON.stringify(payload),
      types: [
        VENUES_ADD_REQUEST,
        VENUES_ADD_SUCCESS,
        VENUES_ADD_FAILURE
      ]
    }
  }).then(() => dispatch(refreshToken()))
}

export const updateVenue = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/venues/${payload._id}`,
      method: 'PUT',
      body: JSON.stringify(payload),
      types: [
        VENUES_UPDATE_REQUEST,
        VENUES_UPDATE_SUCCESS,
        VENUES_UPDATE_FAILURE
      ]
    }
  }
}

export const addVenueMember = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/venues/${payload.venue_id}/members`,
      method: 'POST',
      body: JSON.stringify(payload),
      types: [
        VENUES_UPDATE_REQUEST,
        VENUES_UPDATE_SUCCESS,
        VENUES_UPDATE_FAILURE
      ]
    }
  }
}

export const updateVenueMember = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/venues/${payload.venue_id}/members/${payload._id}`,
      method: 'PUT',
      body: JSON.stringify(payload),
      types: [
        VENUES_UPDATE_REQUEST,
        VENUES_UPDATE_SUCCESS,
        VENUES_UPDATE_FAILURE
      ]
    }
  }
}

export const removeVenueMember = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/venues/${payload.venue_id}/members/${payload._id}`,
      method: 'DELETE',
      types: [
        VENUES_UPDATE_REQUEST,
        VENUES_UPDATE_SUCCESS,
        VENUES_UPDATE_FAILURE
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
  changeCurrentVenue,
  addVenueMember,
  updateVenueMember,
  removeVenueMember
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
      current: state.current || (action.payload[0] && action.payload[0]._id) || null
    }
  },
  [VENUES_CURRENT_CHANGE] : (state, action) => {
    return {
      ...state,
      current: action.payload
    }
  },
  [VENUES_UPDATE_REQUEST] : (state, action) => {
    return {
      ...state,
      isSaving: true
    }
  },
  [VENUES_UPDATE_SUCCESS] : (state, action) => {
    return {
      ...state,
      isSaving: false,
      items: state.items.map((item) => {
        if (item._id === action.payload._id) {
          item = action.payload
        }
        return item
      })
    }
  },
  [VENUES_ADD_REQUEST] : (state, action) => {
    return {
      ...state,
      isSaving: true
    }
  },
  [VENUES_ADD_SUCCESS] : (state, action) => {
    return {
      ...state,
      isSaving: false,
      items: [
        ...state.items,
        action.payload
      ],
      current: action.payload._id
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false,
  isSaving: false,
  items: [],
  current: null
}
export default function venueReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
