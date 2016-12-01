import { injectReducer } from '../../store/reducers'
import protectRoute from '../../utils/protectRoute'

// Sync route definition
export default (store) => ({
  path: 'venue',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const venue = require('./containers/VenueContainer').default
      const reducer = require('./modules/venue').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'venue', reducer })

      /*  Return getComponent   */
      cb(null, venue)

    /* Webpack named bundle   */
    }, 'venue')
  },
  onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
})
