// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout'
import BaseLayout from '../layouts/BaseLayout/BaseLayout'
import StockRoute from './Stock'
import OrdersRoute from './Orders'
import ProductsRoute from './Products'
import VenueRoute from './Venue'
import SuppliersRoute from './Suppliers'
import SettingsRoute from './Settings'
import ProfileRoute from './UserProfile'
import LoginRoute from './Login'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/',
  component   : BaseLayout,
  indexRoute: { onEnter: (nextState, replace) => replace('/stock') },
  childRoutes : [
    {
      component: CoreLayout,
      childRoutes: [
        StockRoute(store),
        ProductsRoute(store),
        VenueRoute(store),
        SuppliersRoute(store),
        SettingsRoute(store),
        OrdersRoute(store)
      ]
    },
    ProfileRoute(store),
    LoginRoute(store)
  ]
})

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
