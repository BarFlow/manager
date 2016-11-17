import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const PRODUCTS_FETCH_REQUEST = 'PRODUCTS_FETCH_REQUEST'
export const PRODUCTS_FETCH_SUCCESS = 'PRODUCTS_FETCH_SUCCESS'
export const PRODUCTS_FETCH_FAILURE = 'PRODUCTS_FETCH_FAILURE'

export const PRODUCT_UPDATE_REQUEST = 'PRODUCT_UPDATE_REQUEST'
export const PRODUCT_UPDATE_SUCCESS = 'PRODUCT_UPDATE_SUCCESS'
export const PRODUCT_UPDATE_FAILURE = 'PRODUCT_UPDATE_FAILURE'

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
        {
          type: PRODUCTS_FETCH_REQUEST,
          meta: (action, state) => {
            return filters
          }
        },
        {
          type: PRODUCTS_FETCH_SUCCESS,
          meta: (action, state, res) => {
            return parseInt(res.headers.get('X-Total-Count'), 10)
          }
        },
        PRODUCTS_FETCH_FAILURE
      ]
    }
  }
}

export const updateProduct = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/inventory/${payload._id}?populate=true`,
      method: 'PUT',
      body: JSON.stringify(payload),
      types: [
        PRODUCT_UPDATE_REQUEST,
        PRODUCT_UPDATE_SUCCESS,
        PRODUCT_UPDATE_FAILURE
      ]
    }
  }
}

export const actions = {
  fetchProducts,
  updateProduct
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [PRODUCTS_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      filters: {
        ...state.filters,
        ...action.meta
      },
      totalCount: 0,
      items:[]
    }
  },
  [PRODUCTS_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      totalCount: action.meta,
      items: action.payload
    }
  },
  [PRODUCT_UPDATE_SUCCESS] : (state, action) => {
    return {
      ...state,
      items: state.items.map((item) => {
        if (item._id === action.payload._id) {
          item = action.payload
        }
        return item
      })
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false,
  filters: {
    limit: 30,
    skip: 0
  },
  totalCount: 0,
  items: []
}
export default function productsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
