import React, { Component } from 'react'
import { Button, Alert, Pagination } from 'react-bootstrap'
import './Products.scss'
import SubHeader from '../../../components/SubHeader'
import SearchBar from '../../../components/SearchBar'
import AddProductDialog from './AddProductDialog'
import ProductListItem from './ProductListItem'

class Products extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.fetchProducts = this.props.fetchProducts.bind(this)
    this.changeProductsFilter = this.props.changeProductsFilter.bind(this)
    this.updateProduct = this.props.updateProduct.bind(this)
    this.fetchTypes = this.props.fetchTypes.bind(this)
    this.handlePaginationSelect = this.handlePaginationSelect.bind(this)
  }

  componentDidMount () {
    // Fetch products if there is new venueId
    if (this.props.venueId && !this.props.products.items.length) {
      this.fetchProducts(this.props.venueId)
    }

    // Fetch types if they are not in store yet
    if (!this.props.types.items.length) {
      this.fetchTypes()
    }
  }

  componentWillReceiveProps (nextProps) {
    // Only fetch new products for new venue
    if (this.props.venueId !== nextProps.venueId) {
      this.fetchProducts(nextProps.venueId)
    }
  }

  handlePaginationSelect (page) {
    const { products } = this.props
    this.changeProductsFilter({
      ...products.filters,
      skip: (products.filters.limit * (page - 1))
    })
  }

  render () {
    const { products, types, venueId, toggleAddNewDialog, fetchCatalog, addProduct } = this.props

    const ProductList = products.filteredItems.map(item =>
      <ProductListItem key={item._id} item={item} updateProduct={this.updateProduct} />
    ).splice(products.filters.skip, products.filters.limit)

    const addProductDialog = venueId && <AddProductDialog
      close={toggleAddNewDialog}
      handleSubmit={fetchCatalog}
      addProduct={addProduct}
      state={products.addNew}
      products={products.items}
      venueId={venueId} />

    return (
      <div className='row'>
        <SubHeader
          left={<h3>Products</h3>}
          right={
            <div>
              {addProductDialog}
              <Button onClick={toggleAddNewDialog} disabled={!venueId}>Add new</Button>
            </div>
          } />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 products'>

          <SearchBar
            filters={products.filters}
            onChange={this.changeProductsFilter}
            types={types} />

          <div className='items'>
            {!products.isFetching && venueId ? (
              products.filteredItems.length ? (
                <div>
                  {ProductList}

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
              ) : (<Alert bsStyle='warning'>No items found.</Alert>)
            ) : (
              <Alert bsStyle='warning'>Loading...</Alert>
            )}
          </div>

        </div>

      </div>
    )
  }
}

Products.propTypes = {
  fetchTypes: React.PropTypes.func.isRequired,
  types: React.PropTypes.object.isRequired,
  fetchProducts: React.PropTypes.func.isRequired,
  changeProductsFilter: React.PropTypes.func.isRequired,
  addProduct: React.PropTypes.func.isRequired,
  updateProduct: React.PropTypes.func.isRequired,
  toggleAddNewDialog: React.PropTypes.func.isRequired,
  fetchCatalog: React.PropTypes.func.isRequired,
  products: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string
}
export default Products
