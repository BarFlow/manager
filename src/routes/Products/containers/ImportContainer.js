import { connect } from 'react-redux'
import {
  fetchProducts,
  addProduct,
  fetchCatalog
} from '../modules/products'
import { fetchSuppliers } from '../../Suppliers/modules/suppliers'
import { withRouter } from 'react-router'
import formApiAdapter from '../../../utils/formApiAdapter'
import { fetchTypes } from '../../../store/types'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the products:   */

import ImportView from '../components/ImportProducts/ImportView'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around fetchProdcusts; the component doesn't care   */

const mapDispatchToProps = (dispatch) => ({
  fetchProducts: (...args) => dispatch(fetchProducts(...args)),
  fetchTypes: (...args) => dispatch(fetchTypes(...args)),
  fetchCatalog: (...args) => dispatch(fetchCatalog(...args)),
  fetchSuppliers: (...args) => dispatch(fetchSuppliers(...args)),
  addProduct: formApiAdapter(dispatch, addProduct)
})

const mapStateToProps = (state) => ({
  products : state.products,
  venueId: state.venues.current,
  types: state.types,
  catalog: state.catalog,
  suppliers: state.suppliers
})

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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ImportView))
