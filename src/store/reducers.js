import { combineReducers } from 'redux'
import locationReducer from './location'
import authReducer from './auth'

export const makeRootReducer = (asyncReducers) => {
  const appReducer = combineReducers({
    auth: authReducer,
    location: locationReducer,
    ...asyncReducers
  })

  return (state, action) => {
    if (action.type === 'USER_LOGOUT') {
      state = undefined
    }

    return appReducer(state, action)
  }
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
