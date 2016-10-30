import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const PRODUCTS_FETCH_REQUEST = 'PRODUCTS_FETCH_REQUEST'
export const PRODUCTS_FETCH_SUCCESS = 'PRODUCTS_FETCH_SUCCESS'
export const PRODUCTS_FETCH_FAILURE = 'PRODUCTS_FETCH_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchProducts = (filters) => {
  const params = Object.keys(filters).reduce((mem, key) =>
    mem + '&' + key + '=' + filters[key]
  , '').substring(1)
  return {
    [CALL_API]: {
      endpoint: `/inventory?populate=true&${params}`,
      method: 'GET',
      types: [
        PRODUCTS_FETCH_REQUEST,
        PRODUCTS_FETCH_SUCCESS,
        PRODUCTS_FETCH_FAILURE
      ]
    }
  }
}

export const actions = {
  fetchProducts
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PRODUCTS_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      items: []
    }
  },
  [PRODUCTS_FETCH_SUCCESS] : (state, action) => {
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
export default function productsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
