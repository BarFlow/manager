import { connect } from 'react-redux'
import _ from 'lodash'

import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleAddNewDialog,
  fetchCatalog,
  changeProductsFilter,
  filterProductItems
} from '../modules/products'
import { fetchSuppliers } from '../../Suppliers/modules/suppliers'
import { withRouter } from 'react-router'
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
  fetchSuppliers: (...args) => dispatch(fetchSuppliers(...args)),
  updateProduct: formApiAdapter(dispatch, updateProduct),
  deleteProduct: formApiAdapter(dispatch, deleteProduct),
  addProduct: formApiAdapter(dispatch, addProduct)
})

const mapStateToProps = (state) => {
  const { filters } = state.products
  const filteredItems = filterProductItems(state.products.items, filters)
  return {
    products : {
      ...state.products,
      filteredItems: _.orderBy(filteredItems, ['product_id.category', 'product_id.sub_category', 'product_id.name'])
    },
    venueId: state.venues.current,
    types: state.types,
    suppliers: state.suppliers
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ProductsView))
