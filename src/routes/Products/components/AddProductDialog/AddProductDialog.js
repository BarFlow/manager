import React, { Component } from 'react'
import { Modal, Alert, Button } from 'react-bootstrap'
import SearchBar from './SearchBar'
import ListItem from './ListItem'
import './AddProductDialog.scss'

class AddProductDialog extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.props.handleSubmit.bind(this)
    this._addProduct = this._addProduct.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.products.addNew.dialogOpen && !this.props.products.addNew.dialogOpen) {
      this.props.handleSubmit()
    }
  }

  _addProduct (item) {
    const product = {
      product_id: item._id,
      venue_id: this.props.venueId
    }
    this.props.addProduct(product)
  }

  render () {
    const { close, handleSubmit, products, toggleCatalogAddDialog } = this.props
    return (
      <Modal show={products.addNew.dialogOpen} onHide={close} className='add-product-dialog'>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchBar onSubmit={handleSubmit} submitting={products.catalog.isFetching} />
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
                <div>
                  <Alert bsStyle='warning'>Product not found.</Alert>
                  <div className='text-center'>
                    <Button onClick={toggleCatalogAddDialog}>Create Product</Button>
                  </div>
                </div>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          Showing {products.catalog.items.length} of {products.catalog.totalCount} items.
        </Modal.Footer>
      </Modal>
    )
  }
}

AddProductDialog.propTypes = {
  handleSubmit : React.PropTypes.func.isRequired,
  products : React.PropTypes.object,
  close: React.PropTypes.func.isRequired,
  addProduct: React.PropTypes.func.isRequired,
  toggleCatalogAddDialog: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string.isRequired
}
export default AddProductDialog
