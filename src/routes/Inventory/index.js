import Inventory from './components/Inventory'
import ReportView from './components/ReportView'
import ArchiveView from './components/ArchiveView'
import protectRoute from '../../utils/protectRoute'

// Sync route definition
export default (store) => ({
  path: 'inventory',
  component : Inventory,
  indexRoute: {
    component: ReportView,
    onEnter: (nextState, replace) => replace('/inventory/reports/live')
  },
  childRoutes: [
    {
      path: 'reports/:id',
      component: ReportView
    },
    {
      path: 'archive',
      component: ArchiveView
    }
  ],
  onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
})
