import React, { Component } from 'react'
import { Alert, Button } from 'react-bootstrap'

import SearchBar from './SearchBar'
import ListItem from './ListItem'

import CreateProductDialog from '../CreateProduct/Dialog'

import './AddProduct.scss'

class AddProductDialog extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isCreateDialogOpen: false,
      searchedProduct: ''
    }

    this._handleSearch = this._handleSearch.bind(this)
    this._addProduct = this._addProduct.bind(this)
    this._toggleCreateProductDialog = this._toggleCreateProductDialog.bind(this)
  }

  componentDidMount () {
    this.props.handleSearch()
  }

  _addProduct (item) {
    const product = {
      product_id: item._id,
      venue_id: this.props.venueId
    }
    this.props.addProduct(product)
  }

  _toggleCreateProductDialog () {
    this.setState({
      isCreateDialogOpen: !this.state.isCreateDialogOpen
    })
  }

  _handleSearch (filters) {
    this.setState({ searchedProduct: filters.name })
    this.props.handleSearch(filters)
  }

  render () {
    const { products } = this.props
    return (
      <div className='add-product'>
        <CreateProductDialog
          isOpen={this.state.isCreateDialogOpen}
          close={this._toggleCreateProductDialog}
          initialValues={{ name: this.state.searchedProduct }} />

        <SearchBar onSubmit={this._handleSearch} submitting={products.catalog.isFetching} />
        {products.catalog.items.length ? (
          products.catalog.items.map(item => {
            const added = !!products.items.find(product => product.product_id._id === item._id)
            return <ListItem key={item._id} item={item} added={added} onSelect={this._addProduct} />
          }
          )
        ) : (
          products.catalog.isFetching ? (
            <Alert bsStyle='warning'>Loading...</Alert>
          ) : (
            (products.catalog.filters.name) &&
              <Alert bsStyle='warning'>Product not found.</Alert>
          )
        )}
        {!products.catalog.isFetching &&
          <div>
            {!!products.catalog.items.length &&
              <div className='text-right'>
                Showing {products.catalog.items.length} of {products.catalog.totalCount} items.
              </div>
            }
            <div className='product-add-footer'>
              <div className='text-center'>
                <Alert bsStyle='info'>
                  If you don't see your product in the list above, you can always just create it manually.
                </Alert>
                <Button onClick={this._toggleCreateProductDialog}>Create Product</Button>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

AddProductDialog.propTypes = {
  handleSearch : React.PropTypes.func.isRequired,
  products : React.PropTypes.object,
  close: React.PropTypes.func.isRequired,
  addProduct: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string.isRequired
}
export default AddProductDialog
