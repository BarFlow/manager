import Inventory from './components/Inventory'
import protectRoute from '../../utils/protectRoute'

// Sync route definition
export default (store) => ({
  path: 'inventory',
  component : Inventory,
  onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
})
