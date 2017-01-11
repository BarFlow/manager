import { CALL_API } from 'redux-api-middleware'

const buildTypeTree = (types) => {
  return types.reduce((mem, type) => {
    type.children = types.reduce((mem, item) => {
      if (item.parent_id === type._id) {
        mem[item.title] = item
      }
      return mem
    }, {})
    if (!type.parent_id) {
      mem[type.title] = type
    }
    return mem
  }, {})
}

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
    const lowercasedTypes = action.payload.map(type => {
      type.title = type.title.toLowerCase()
      return type
    })
    return {
      ...state,
      isFetching: false,
      items: lowercasedTypes,
      tree: buildTypeTree(lowercasedTypes)
    }
  }
}

// ------------------------------------
// Reducer
// -----------------------------------
const initialState = {
  isFetching: false,
  items: [],
  tree: {}
}
export default function venueReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
