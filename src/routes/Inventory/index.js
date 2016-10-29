import InventoryView from './components/InventoryView'
import protectRoute from '../../utils/protectRoute'

// Sync route definition
export default (store) => ({
  path: 'inventory',
  component : InventoryView,
  onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
})
