import { CALL_API } from 'redux-api-middleware'

// ------------------------------------
// Constants
// ------------------------------------
export const SUPPLIERS_FETCH_REQUEST = 'suppliers/FETCH_REQUEST'
export const SUPPLIERS_FETCH_SUCCESS = 'suppliers/FETCH_SUCCESS'
export const SUPPLIERS_FETCH_FAILURE = 'suppliers/FETCH_FAILURE'

export const SUPPLIERS_UPDATE_REQUEST = 'suppliers/UPDATE_REQUEST'
export const SUPPLIERS_UPDATE_SUCCESS = 'suppliers/UPDATE_SUCCESS'
export const SUPPLIERS_UPDATE_FAILURE = 'suppliers/UPDATE_FAILURE'

export const SUPPLIERS_ADD_REQUEST = 'suppliers/ADD_REQUEST'
export const SUPPLIERS_ADD_SUCCESS = 'suppliers/ADD_SUCCESS'
export const SUPPLIERS_ADD_FAILURE = 'suppliers/ADD_FAILURE'

export const SUPPLIERS_DELETE_REQUEST = 'suppliers/DELETE_REQUEST'
export const SUPPLIERS_DELETE_SUCCESS = 'suppliers/DELETE_SUCCESS'
export const SUPPLIERS_DELETE_FAILURE = 'suppliers/DELETE_FAILURE'

export const SUPPLIERS_TOGGLE_ADD_DIALOG = 'suppliers/TOGGLE_ADD_DIALOG'

export const CATALOG_FETCH_REQUEST = 'suppliers/CATALOG_FETCH_REQUEST'
export const CATALOG_FETCH_SUCCESS = 'suppliers/CATALOG_FETCH_SUCCESS'
export const CATALOG_FETCH_FAILURE = 'suppliers/CATALOG_FETCH_FAILURE'

// ------------------------------------
// Actions
// ------------------------------------
export const fetchSuppliers = (venueId) => {
  return {
    [CALL_API]: {
      endpoint: `/suppliers?venue_id=${venueId}`,
      method: 'GET',
      types: [
        SUPPLIERS_FETCH_REQUEST,
        SUPPLIERS_FETCH_SUCCESS,
        SUPPLIERS_FETCH_FAILURE
      ]
    }
  }
}

export const addSupplier = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/suppliers`,
      method: 'POST',
      body: JSON.stringify(payload),
      types: [
        SUPPLIERS_ADD_REQUEST,
        SUPPLIERS_ADD_SUCCESS,
        SUPPLIERS_ADD_FAILURE
      ]
    }
  }
}

export const updateSupplier = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/suppliers/${payload._id}`,
      method: 'PUT',
      body: JSON.stringify(payload),
      types: [
        SUPPLIERS_UPDATE_REQUEST,
        SUPPLIERS_UPDATE_SUCCESS,
        SUPPLIERS_UPDATE_FAILURE
      ]
    }
  }
}

export const deleteSupplier = (payload) => {
  return {
    [CALL_API]: {
      endpoint: `/suppliers/${payload._id}`,
      method: 'DELETE',
      types: [
        SUPPLIERS_DELETE_REQUEST,
        SUPPLIERS_DELETE_SUCCESS,
        SUPPLIERS_DELETE_FAILURE
      ]
    }
  }
}

export const toggleAddNewDialog = () => ({
  type: SUPPLIERS_TOGGLE_ADD_DIALOG
})

export const fetchCatalog = () => {
  return {
    [CALL_API]: {
      endpoint: '/suppliers',
      method: 'GET',
      types: [
        CATALOG_FETCH_REQUEST,
        CATALOG_FETCH_SUCCESS,
        CATALOG_FETCH_FAILURE
      ]
    }
  }
}

export const actions = {
  fetchSuppliers,
  updateSupplier,
  deleteSupplier,
  addSupplier,
  toggleAddNewDialog,
  fetchCatalog
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SUPPLIERS_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      isFetching: true,
      items:[]
    }
  },
  [SUPPLIERS_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      isFetching: false,
      items: action.payload
    }
  },
  [SUPPLIERS_ADD_REQUEST] : (state, action) => {
    return {
      ...state,
      addNew: {
        ...state.addNew,
        isSubmitting: true
      }
    }
  },
  [SUPPLIERS_ADD_SUCCESS] : (state, action) => {
    return {
      ...state,
      items: [
        action.payload,
        ...state.items
      ]
    }
  },
  [SUPPLIERS_DELETE_SUCCESS] : (state, action) => {
    return {
      ...state,
      items: state.items.filter(item => item._id !== action.payload._id)
    }
  },
  [SUPPLIERS_UPDATE_SUCCESS] : (state, action) => {
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
  [SUPPLIERS_TOGGLE_ADD_DIALOG] : (state, action) => {
    return {
      ...state,
      addNew: {
        dialogOpen: !state.addNew.dialogOpen,
        isFetching: false,
        items: [],
        filters: {}
      }
    }
  },
  [CATALOG_FETCH_REQUEST] : (state, action) => {
    return {
      ...state,
      addNew: {
        ...state.addNew,
        isFetching: true,
        items: []
      }
    }
  },
  [CATALOG_FETCH_SUCCESS] : (state, action) => {
    return {
      ...state,
      addNew: {
        ...state.addNew,
        isFetching: false,
        items: action.payload
      }
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false,
  items: [],
  addNew: {
    dialogOpen: false,
    isFetching: false,
    isSubmitting: false,
    items: []
  }
}
export default function productsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
