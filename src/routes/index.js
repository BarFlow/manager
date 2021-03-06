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
import VenuesRoute from './Venues'
import LoginRoute from './Login'
import SignupRoute from './Signup'

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/',
  component   : BaseLayout,
  indexRoute: { onEnter: (nextState, replace) => replace('/stock')
  },
  childRoutes : [
    {
      onEnter: (nextState, replace) => {
        const state = store.getState()
        const manageableVenues = state.auth.user && state.auth.user.roles &&
          Object.keys(state.auth.user.roles)
          .filter(key => state.auth.user.roles[key] !== 'staff') || []
        if (state.auth && state.auth.user && !manageableVenues.length) {
          replace('/venues')
        }
      },
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
    VenuesRoute(store),
    LoginRoute(store),
    SignupRoute(store),
    // If route not found, redirect to root
    {
      path: '*',
      onEnter: (nextState, replace) => replace('/')
    }
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
