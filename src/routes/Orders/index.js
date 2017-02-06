// import { injectReducer } from '../../store/reducers'
import protectRoute from '../../utils/protectRoute'

// Sync route definition
export default (store) => ({
  path: 'orders',
  indexRoute: {
    /*  Async getComponent is only invoked when route matches   */
    getComponent (nextState, cb) {
      /*  Webpack - use 'require.ensure' to create a split point
          and embed an async module loader (jsonp) when bundling   */
      require.ensure([], (require) => {
        /*  Webpack - use require callback to define
            dependencies for bundling   */
        const Orders = require('./components/ArchiveView').default
        // const reducer = require('./modules/products').default

        /*  Add the reducer to the store on key 'counter'  */
        // injectReducer(store, { key: 'products', reducer })

        /*  Return getComponent   */
        cb(null, Orders)

      /* Webpack named bundle   */
      }, 'products')
    },
    onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
  },
  childRoutes: [
    {
      path: 'create',
      /*  Async getComponent is only invoked when route matches   */
      getComponent (nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
            and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
          /*  Webpack - use require callback to define
              dependencies for bundling   */
          const CartView = require('./components/CartView').default
          // const reducer = require('./modules/products').default

          /*  Add the reducer to the store on key 'counter'  */
          // injectReducer(store, { key: 'products', reducer })

          /*  Return getComponent   */
          cb(null, CartView)

        /* Webpack named bundle   */
        }, 'products-import')
      },
      onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
    }
  ]
})
