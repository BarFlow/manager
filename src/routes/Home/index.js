import HomeView from './components/HomeView'
import protectRoute from '../utils/protectRoute'

// Sync route definition
export default (store) => ({
  path: 'home',
  component : HomeView,
  onEnter: (nextState, replace) => protectRoute(nextState, replace, store)
})
