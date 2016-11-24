import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import locationReducer from './location'
import authReducer from './auth'
import venuesReducer from './venues'
import typesReducer from './types'
import suppliersReducer from '../routes/Suppliers/modules/suppliers'

export const makeRootReducer = (asyncReducers) => {
  const appReducer = combineReducers({
    auth: authReducer,
    location: locationReducer,
    form: formReducer,
    venues: venuesReducer,
    types: typesReducer,
    suppliers: suppliersReducer,
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
