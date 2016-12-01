import { connect } from 'react-redux'
import {
  fetchVenueItems,
  addVenueItem,
  updateVenueItem,
  batchUpdateVenueItems,
  deleteVenueItem,
  toggleAddNewDialog,
  updatePath
} from '../modules/venue'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the products:   */

import VenueView from '../components/VenueView'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around fetchProdcusts; the component doesn't care   */

const mapDispatchToProps = {
  fetchVenueItems,
  addVenueItem,
  updateVenueItem,
  batchUpdateVenueItems,
  deleteVenueItem,
  toggleAddNewDialog,
  updatePath
}

const mapStateToProps = (state) => (
  {
    venue : state.venue,
    venueId: state.venues.current,
    location: state.location,
    products: state.products
  }
)

/*  Note: mapStateToProps is where you should use `reselect` to create selectors, ie:

    import { createSelector } from 'reselect'
    const products = (state) => state.products
    const tripleCount = createSelector(products, (count) => count * 3)
    const mapStateToProps = (state) => ({
      products: tripleCount(state)
    })

    Selectors can compute derived data, allowing Redux to store the minimal possible state.
    Selectors are efficient. A selector is not recomputed unless one of its arguments change.
    Selectors are composable. They can be used as input to other selectors.
    https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapDispatchToProps)(VenueView)
