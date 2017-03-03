// import { injectReducer } from '../../store/reducers'
import protectRoute from '../../utils/protectRoute'

// Sync route definition
export default (store) => ({
  path: 'venues',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const VenuesView = require('./containers/VenuesViewContainer').default
      // const reducer = require('./modules/user').default

      /*  Add the reducer to the store on key 'counter'  */
      // injectReducer(store, { key: 'user', reducer })

      /*  Return getComponent   */
      cb(null, VenuesView)

    /* Webpack named bundle   */
    }, 'venues')
  },
  onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
})
