import React, { Component } from 'react'
import { Button, Alert, Pagination } from 'react-bootstrap'
import { Link } from 'react-router'

import SubHeader from '../../../components/SubHeader'
import SearchBar from '../../../containers/SearchBarContainer'
import AddProductDialog from './AddProduct/Dialog'
import ProductListItem from './ProductListItem'

import './Products.scss'

class Products extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isAddProductDialogOpen: false
    }

    this._updateProductsFilterAndURI = this._updateProductsFilterAndURI.bind(this)
    this.handlePaginationSelect = this.handlePaginationSelect.bind(this)
    this.toggleAddNewDialog = this.toggleAddNewDialog.bind(this)
  }

  componentDidMount () {
    const {
      venueId, products, changeProductsFilter, fetchProducts, suppliers, fetchSuppliers, types, fetchTypes, location
    } = this.props
    // Fetch products if there is new venueId or no products in store yet
    if ((venueId && !products.items.length) || (venueId && venueId !== products.filters.venue_id)) {
      fetchProducts(venueId)
    } else if (venueId && products.items.length) {
      // Silent fetch new products
      fetchProducts(venueId, true)
    }

    // Fetch suppliers if needed
    if (
      (!suppliers.items.length && !suppliers.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && suppliers.items.length && venueId !== suppliers.items[0].venue_id)
    ) {
      fetchSuppliers(venueId)
    }

    // Fetch types if they are not in store yet
    if (!types.items.length) {
      fetchTypes()
    }

    // Load current filters from URI
    changeProductsFilter({
      venue_id: venueId,
      ...location.query
    })
  }

  componentWillUnmount () {
    // Flush filters when unmount
    this.props.changeProductsFilter({ venue_id: this.props.venueId })
  }

  componentWillReceiveProps (nextProps) {
    const {
      venueId, changeProductsFilter, fetchProducts, fetchSuppliers, location
    } = this.props

    if (venueId !== nextProps.venueId) {
      // Only fetch new products for new venue_id
      fetchProducts(nextProps.venueId)

      // Fetch new suppliers
      fetchSuppliers(nextProps.venueId)
    }

    if (venueId && venueId !== nextProps.venueId) {
      // Update venue_id in URI if it has changed
      this._updateProductsFilterAndURI({ venue_id: nextProps.venueId })
    }

    // Update filters when URI has changed from outside of the component
    if (nextProps.location.action === 'PUSH' && location.search !== nextProps.location.search) {
      changeProductsFilter({
        ...nextProps.location.query,
        venue_id: nextProps.venueId
      })
    }

    // Scroll to top if search is emptyed (left hand menubar link click)
    if (location.key !== nextProps.location.key && !nextProps.location.search) {
      window.scrollTo(0, 0)
    }
  }

  _updateProductsFilterAndURI (filters) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.props.router.replace({
        pathname: this.props.location.pathname,
        query: filters
      })
    }, 500)

    this.props.changeProductsFilter(filters)
  }

  handlePaginationSelect (page) {
    const { products } = this.props
    const filters = {
      ...products.filters,
      skip: (products.filters.limit * (page - 1))
    }
    this._updateProductsFilterAndURI(filters)
    window.scrollTo(0, 0)
  }

  toggleAddNewDialog () {
    this.setState({
      isAddProductDialogOpen: !this.state.isAddProductDialogOpen
    })
  }

  render () {
    const {
      products,
      venueId,
      addProduct,
      updateProduct,
      deleteProduct,
      fetchCatalog,
      suppliers
    } = this.props

    const ProductList = products.filteredItems.map(item =>
      <ProductListItem
        key={item._id}
        item={item}
        suppliers={suppliers}
        updateProduct={updateProduct}
        deleteProduct={deleteProduct} />
    ).splice(products.filters.skip, products.filters.limit)

    // const productsWithMissingFileds = products.filteredItems.filter(item => item.hasMissingField)

    const addProductDialog = venueId && <AddProductDialog
      close={this.toggleAddNewDialog}
      isOpen={this.state.isAddProductDialogOpen}
      handleSearch={fetchCatalog}
      addProduct={addProduct}
      products={products}
      venueId={venueId} />

    return (
      <div className='row'>
        {addProductDialog}
        <SubHeader
          className='bg-yellow'
          left={<h3>Products</h3>}
          right={
            <div>
              <Button onClick={this.toggleAddNewDialog} disabled={!venueId}>Add Product</Button>
              <Link className='btn btn-default' to='/products/import'>Import</Link>
            </div>
          } />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 products'>

          <SearchBar
            filters={products.filters}
            onChange={this._updateProductsFilterAndURI} />

          {/* !!productsWithMissingFileds.length &&
            <div>
              <Alert bsStyle='warning'>
                <strong>Warning!</strong>
                {' '}{productsWithMissingFileds.length} product
                {productsWithMissingFileds.length > 1 &&
                  's'
                }
                {' '}found with missing information.
              </Alert>
              <div className='missing-fields'>
                <Checkbox
                  checked={!!products.filters.hasMissingField}
                  onChange={() =>
                    this._updateProductsFilterAndURI({
                      ...products.filters,
                      hasMissingField: products.filters.hasMissingField ? undefined : true
                    })}>
                    Only show products with missing information
                  </Checkbox>
              </div>
            </div>
          */}

          <div className='items'>
            {!venueId || products.isFetching ? (
              <Alert bsStyle='warning'>Loading...</Alert>
            ) : (
              products.filteredItems.length ? (
                ProductList
              ) : (
                <Alert bsStyle='warning'>No items found.</Alert>
              )
            )}
          </div>

          {products.filteredItems.length > products.filters.limit &&
            <div className='text-center'>
              <Pagination ellipsis boundaryLinks
                items={Math.ceil(products.filteredItems.length / products.filters.limit)}
                maxButtons={9}
                activePage={(products.filters.skip / products.filters.limit) + 1}
                onSelect={this.handlePaginationSelect} />
            </div>
          }
        </div>

      </div>
    )
  }
}

Products.propTypes = {
  router: React.PropTypes.object,
  location: React.PropTypes.object,
  fetchTypes: React.PropTypes.func.isRequired,
  fetchCatalog: React.PropTypes.func.isRequired,
  types: React.PropTypes.object.isRequired,
  suppliers: React.PropTypes.object.isRequired,
  fetchSuppliers: React.PropTypes.func.isRequired,
  fetchProducts: React.PropTypes.func.isRequired,
  changeProductsFilter: React.PropTypes.func.isRequired,
  addProduct: React.PropTypes.func.isRequired,
  updateProduct: React.PropTypes.func.isRequired,
  deleteProduct: React.PropTypes.func.isRequired,
  products: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string
}
export default Products
