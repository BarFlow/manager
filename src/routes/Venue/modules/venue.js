import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const VENUE_ITEMS_FETCH_REQUEST = 'venue/FETCH_ITEMS_REQUEST'
export const VENUE_ITEMS_FETCH_SUCCESS = 'venue/FETCH_ITEMS_SUCCESS'
export const VENUE_ITEMS_FETCH_FAILURE = 'venue/FETCH_ITEMS_FAILURE'

export const VENUE_ITEM_ADD_REQUEST = 'venue/ADD_ITEM_REQUEST'
export const VENUE_ITEM_ADD_SUCCESS = 'venue/ADD_ITEM_SUCCESS'
export const VENUE_ITEM_ADD_FAILURE = 'venue/ADD_ITEM_FAILURE'

export const VENUE_ITEM_UPDATE_REQUEST = 'venue/UPDATE_ITEM_REQUEST'
export const VENUE_ITEM_UPDATE_SUCCESS = 'venue/UPDATE_ITEM_SUCCESS'
export const VENUE_ITEM_UPDATE_FAILURE = 'venue/UPDATE_ITEM_FAILURE'

export const VENUE_ITEMS_BATCH_UPDATE_REQUEST = 'venue/UPDATE_ITEMS_BATCH_REQUEST'
export const VENUE_ITEMS_BATCH_UPDATE_SUCCESS = 'venue/UPDATE_ITEMS_BATCH_SUCCESS'
export const VENUE_ITEMS_BATCH_UPDATE_FAILURE = 'venue/UPDATE_ITEMS_BATCH_FAILURE'

export const VENUE_ITEM_DELETE_REQUEST = 'venue/DELETE_REQUEST'
export const VENUE_ITEM_DELETE_SUCCESS = 'venue/DELETE_SUCCESS'
export const VENUE_ITEM_DELETE_FAILURE = 'venue/DELETE_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchVenueItems = ({ type, filterKey, filterValue }) => {
  return {
    [CALL_API]: {
      endpoint: `/${type}?${filterKey}=${filterValue}`,
      method: 'GET',
      types: [
        VENUE_ITEMS_FETCH_REQUEST,
        VENUE_ITEMS_FETCH_SUCCESS,
        VENUE_ITEMS_FETCH_FAILURE
      ]
    }
  }
}

export const addVenueItem = ({ type, payload }) => {
  return {
    [CALL_API]: {
      endpoint: `/${type}`,
      method: 'POST',
      body: JSON.stringify(payload),
      types: [
        VENUE_ITEM_ADD_REQUEST,
        VENUE_ITEM_ADD_SUCCESS,
        VENUE_ITEM_ADD_FAILURE
      ]
    }
  }
}

export const updateVenueItem = ({ type, payload }) => {
  return {
    [CALL_API]: {
      endpoint: `/${type}/${payload._id}`,
      method: 'PUT',
      body: JSON.stringify(payload),
      types: [
        VENUE_ITEM_UPDATE_REQUEST,
        VENUE_ITEM_UPDATE_SUCCESS,
        VENUE_ITEM_UPDATE_FAILURE
      ]
    }
  }
}

export const batchUpdateVenueItems = ({ type, payload, sortedItems }) => {
  return {
    [CALL_API]: {
      endpoint: `/${type}`,
      method: 'PUT',
      body: JSON.stringify(payload),
      types: [
        {
          type: VENUE_ITEMS_BATCH_UPDATE_REQUEST,
          payload: (action, state) => {
            return payload
          },
          meta: (action, state) => {
            return sortedItems
          }
        },
        VENUE_ITEMS_BATCH_UPDATE_SUCCESS,
        VENUE_ITEMS_BATCH_UPDATE_FAILURE
      ]
    }
  }
}

export const deleteVenueItem = ({ type, payload }) => {
  return {
    [CALL_API]: {
      endpoint: `/${type}/${payload._id}`,
      method: 'DELETE',
      types: [
        VENUE_ITEM_DELETE_REQUEST,
        VENUE_ITEM_DELETE_SUCCESS,
        VENUE_ITEM_DELETE_FAILURE
      ]
    }
  }
}

export const actions = {
  fetchVenueItems,
  addVenueItem,
  updateVenueItem,
  batchUpdateVenueItems,
  deleteVenueItem
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [VENUE_ITEMS_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      items:[]
    }
  },
  [VENUE_ITEMS_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      items: action.payload
    }
  },
  [VENUE_ITEM_ADD_REQUEST] : (state, action) => {
    return {
      ...state,
      isSubmitting: true
    }
  },
  [VENUE_ITEM_ADD_SUCCESS] : (state, action) => {
    const payload = Array.isArray(action.payload) ? action.payload : [action.payload]
    return {
      ...state,
      items: [
        ...state.items,
        ...payload
      ]
    }
  },
  [VENUE_ITEM_DELETE_SUCCESS] : (state, action) => {
    return {
      ...state,
      items: state.items.filter(item => item._id !== action.payload._id)
    }
  },
  [VENUE_ITEM_UPDATE_SUCCESS] : (state, action) => {
    return {
      ...state,
      items: state.items.map((item) => {
        if (item._id === action.payload._id) {
          item = action.payload
        }
        return item
      })
    }
  },
  [VENUE_ITEMS_BATCH_UPDATE_REQUEST] : (state, action) => {
    return {
      ...state,
      items: action.meta
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false,
  isSubmitting: false,
  items: []
}
export default function productsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
