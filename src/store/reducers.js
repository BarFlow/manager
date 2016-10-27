import { combineReducers } from 'redux'
import locationReducer from './location'
import authReducer from './authReducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    auth: authReducer,
    location: locationReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
