// import { injectReducer } from '../../store/reducers'
import protectRoute from '../../utils/protectRoute'

// Sync route definition
export default (store) => ({
  path: 'orders',
  indexRoute: {
    onEnter: (nextState, replace) => replace('/orders/create')
  },
  childRoutes: [
    {
      path: 'archive',
      /*  Async getComponent is only invoked when route matches   */
      getComponent (nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
          /*  Webpack - use require callback to define
          dependencies for bundling   */
          const Orders = require('./containers/ArchiveViewContainer').default
          // const reducer = require('./modules/products').default

          /*  Add the reducer to the store on key 'counter'  */
          // injectReducer(store, { key: 'products', reducer })

          /*  Return getComponent   */
          cb(null, Orders)

          /* Webpack named bundle   */
        }, 'orders')
      },
      onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
    },
    {
      path: 'create',
      /*  Async getComponent is only invoked when route matches   */
      getComponent (nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
            and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
          /*  Webpack - use require callback to define
              dependencies for bundling   */
          const CartView = require('./containers/CreateViewContainer').default
          // const reducer = require('./modules/products').default

          /*  Add the reducer to the store on key 'counter'  */
          // injectReducer(store, { key: 'products', reducer })

          /*  Return getComponent   */
          cb(null, CartView)

        /* Webpack named bundle   */
        }, 'orders-create')
      },
      onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
    }
  ]
})
