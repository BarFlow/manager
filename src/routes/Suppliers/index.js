import { injectReducer } from '../../store/reducers'
import protectRoute from '../../utils/protectRoute'

// Sync route definition
export default (store) => ({
  path: 'suppliers',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Suppliers = require('./containers/SuppliersContainer').default
      const reducer = require('./modules/suppliers').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'suppliers', reducer })

      /*  Return getComponent   */
      cb(null, Suppliers)

    /* Webpack named bundle   */
    }, 'suppliers')
  },
  onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
})
