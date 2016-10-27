import HomeView from './components/HomeView'
import protectRoute from '../utils/protectRoute.js'

// Sync route definition
export default (store) => ({
  component : HomeView,
  onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
})
