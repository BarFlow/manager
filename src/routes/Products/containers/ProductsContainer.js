import { connect } from 'react-redux'
import {
  fetchProducts,
  addProduct,
  updateProduct,
  toggleAddNewDialog,
  fetchCatalog,
  changeProductsFilter
} from '../modules/products'
import formApiAdapter from '../../../utils/formApiAdapter'
import { fetchTypes } from '../../../store/types'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the products:   */

import ProductsView from '../components/ProductsView'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around fetchProdcusts; the component doesn't care   */

const mapDispatchToProps = (dispatch) => ({
  fetchProducts: (...args) => dispatch(fetchProducts(...args)),
  changeProductsFilter: (...args) => dispatch(changeProductsFilter(...args)),
  fetchTypes: (...args) => dispatch(fetchTypes(...args)),
  toggleAddNewDialog: (...args) => dispatch(toggleAddNewDialog(...args)),
  fetchCatalog: (...args) => dispatch(fetchCatalog(...args)),
  updateProduct: formApiAdapter(dispatch, updateProduct),
  addProduct: formApiAdapter(dispatch, addProduct)
})

const mapStateToProps = (state) => {
  const { filters } = state.products
  const filteredItems = state.products.items.filter(item => {
    const name = new RegExp(filters.name, 'i')
    if (
      item.product_id.name.match(name) &&
      (!filters.type || filters.type === '' || item.product_id.type === filters.type) &&
      (!filters.category || filters.category === '' || item.product_id.category === filters.category) &&
      (!filters.sub_category || filters.sub_category === '' || item.product_id.sub_category === filters.sub_category)
    ) {
      return true
    }
  })
  return {
    products : {
      ...state.products,
      filteredItems
    },
    venueId: state.venues.current,
    types: state.types,
    location: state.location
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductsView)
