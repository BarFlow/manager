import { injectReducer } from '../../store/reducers'
// import ArchiveView from './components/ArchiveView'
import protectRoute from '../../utils/protectRoute'

// Sync route definition
export default (store) => ({
  path: 'inventory',
  indexRoute: {
    onEnter: (nextState, replace) => replace('/inventory/reports/live')
  },
  childRoutes: [
    {
      path: 'reports/:reportId',
      /*  Async getComponent is only invoked when route matches   */
      getComponent (nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
            and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
          /*  Webpack - use require callback to define
              dependencies for bundling   */
          const ReportViewContainer = require('./containers/ReportViewContainer').default
          const reducer = require('./modules/reports').default

          /*  Add the reducer to the store on key 'reports'  */
          injectReducer(store, { key: 'reports', reducer })

          /*  Return getComponent   */
          cb(null, ReportViewContainer)

        /* Webpack named bundle   */
        }, 'report')
      }
    },
    {
      path: 'archive',
      getComponent (nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
            and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
          /*  Webpack - use require callback to define
              dependencies for bundling   */
          const ArchiveViewContainer = require('./containers/ArchiveViewContainer').default
          const reducer = require('./modules/reports').default

          /*  Add the reducer to the store on key 'reports'  */
          injectReducer(store, { key: 'reports', reducer })

          /*  Return getComponent   */
          cb(null, ArchiveViewContainer)

        /* Webpack named bundle   */
        }, 'reports')
      }
    }
  ],
  onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
})
