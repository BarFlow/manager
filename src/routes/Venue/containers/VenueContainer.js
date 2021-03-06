import { connect } from 'react-redux'
import _ from 'lodash'

import {
  fetchVenueItems,
  addVenueItem,
  updateVenueItem,
  batchUpdateVenueItems,
  deleteVenueItem
} from '../modules/venue'
import { fetchProducts } from '../../Products/modules/products'

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
  fetchProducts
}

const mapStateToProps = (state) => {
  const currentVenue = state.venues.items.find(item => item._id === state.venues.current)
  return {
    venue : {
      ...state.venue,
      items: _.orderBy(
        state.venue.items,
        [
          'inventory_item_id.product_id.category',
          'inventory_item_id.product_id.sub_category',
          'order',
          'inventory_item_id.product_id.name'
        ]
      )
    },
    venueId: state.venues.current,
    products: {
      ...state.products,
      items: _.orderBy(state.products.items, ['product_id.category', 'product_id.sub_category', 'product_id.name'])
    },
    types: state.types,
    venueName: currentVenue && currentVenue.profile && currentVenue.profile.name
  }
}

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
