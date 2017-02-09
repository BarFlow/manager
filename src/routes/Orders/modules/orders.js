import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const ORDERS_FETCH_REQUEST = 'orders/FETCH_ORDERS_REQUEST'
export const ORDERS_FETCH_SUCCESS = 'orders/FETCH_ORDERS_SUCCESS'
export const ORDERS_FETCH_FAILURE = 'orders/FETCH_ORDERS_FAILURE'

export const ORDER_FETCH_REQUEST = 'orders/FETCH_ORDER_REQUEST'
export const ORDER_FETCH_SUCCESS = 'orders/FETCH_ORDER_SUCCESS'
export const ORDER_FETCH_FAILURE = 'orders/FETCH_ORDER_FAILURE'

export const ORDER_CREATE_REQUEST = 'orders/CREATE_REQUEST'
export const ORDER_CREATE_SUCCESS = 'orders/CREATE_SUCCESS'
export const ORDER_CREATE_FAILURE = 'orders/CREATE_FAILURE'

export const ORDER_DELETE_REQUEST = 'orders/DELETE_REQUEST'
export const ORDER_DELETE_SUCCESS = 'orders/DELETE_SUCCESS'
export const ORDER_DELETE_FAILURE = 'orders/DELETE_FAILURE'

export const ORDER_CART_ADD_ITEMS = 'orders/ADD_CART_ITEMS'
export const ORDER_CART_DELETE_ITEM = 'orders/DELETE_CART_ITEM'
export const ORDER_CART_UPDATE_ITEM = 'orders/UPDATE_CART_ITEM'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchOrders = (venueId) => {
  return {
    [CALL_API]: {
      endpoint: `/orders?venue_id=${venueId}`,
      method: 'GET',
      types: [
        ORDERS_FETCH_REQUEST,
        ORDERS_FETCH_SUCCESS,
        ORDERS_FETCH_FAILURE
      ]
    }
  }
}

export const fetchOrder = ({ reportId, venueId }) => {
  return {
    [CALL_API]: {
      endpoint: `/orders/${reportId}?venue_id=${venueId}`,
      method: 'GET',
      types: [
        ORDER_FETCH_REQUEST,
        ORDER_FETCH_SUCCESS,
        ORDER_FETCH_FAILURE
      ]
    }
  }
}

export const createOrder = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/orders`,
      method: 'POST',
      body: JSON.stringify(payload),
      types: [
        ORDER_CREATE_REQUEST,
        ORDER_CREATE_SUCCESS,
        ORDER_CREATE_FAILURE
      ]
    }
  }
}

export const deleteOrder = (reportId) => {
  return {
    [CALL_API]: {
      endpoint: `/orders/${reportId}`,
      method: 'DELETE',
      types: [
        ORDER_DELETE_REQUEST,
        ORDER_DELETE_SUCCESS,
        ORDER_DELETE_FAILURE
      ]
    }
  }
}

export const addCartItems = (items) => {
  if (!Array.isArray(items)) {
    items = [items]
  }
  return {
    type: ORDER_CART_ADD_ITEMS,
    payload: items
  }
}

export const updateCartItem = (item) => (
  {
    type: ORDER_CART_UPDATE_ITEM,
    payload: item
  }
)

export const deleteCartItem = (item) => (
  {
    type: ORDER_CART_DELETE_ITEM,
    payload: item
  }
)

export const actions = {
  fetchOrders,
  fetchOrder,
  createOrder,
  deleteOrder,
  addCartItems,
  updateCartItem,
  deleteCartItem
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [ORDERS_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      items:[]
    }
  },
  [ORDERS_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      items: action.payload
    }
  },
  [ORDER_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      items:[]
    }
  },
  [ORDER_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      items: state.items.map(item => {
        if (item._id === action.payload._id) {
          item = action.payload
        }
        return item
      })
    }
  },
  [ORDER_CREATE_REQUEST] : (state, action) => {
    return {
      ...state,
      isSaving: true
    }
  },
  [ORDER_CREATE_SUCCESS] : (state, action) => {
    return {
      ...state,
      isSaving: false,
      items: [
        action.payload,
        ...state.items
      ]
    }
  },
  [ORDER_DELETE_REQUEST] : (state, action) => {
    return {
      ...state,
      isSaving: true
    }
  },
  [ORDER_DELETE_SUCCESS] : (state, action) => {
    return {
      ...state,
      isSaving: false,
      items: state.items.filter(item => item._id !== action.payload._id)
    }
  },
  [ORDER_CART_ADD_ITEMS] : (state, action) => {
    return {
      ...state,
      cart: [...state.cart, ...action.payload]
    }
  },
  [ORDER_CART_UPDATE_ITEM] : (state, action) => {
    return {
      ...state,
      cart: state.cart.map(item => {
        if (item._id === action.payload._id) {
          item = { ...item, ...action.payload }
        }
        return item
      })
    }
  },
  [ORDER_CART_DELETE_ITEM] : (state, action) => {
    return {
      ...state,
      cart: state.cart.filter(item => item._id !== action.payload._id)
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
  cart: []
}
export default function ordersReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
