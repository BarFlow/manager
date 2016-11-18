import React, { Component } from 'react'
import { Modal, Alert } from 'react-bootstrap'
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
    if (nextProps.state.dialogOpen && !this.props.state.dialogOpen) {
      this.props.handleSubmit()
    }
  }

  _addProduct (item) {
    const newProduct = {
      product_id: item._id,
      venue_id: this.props.venueId
    }
    console.log(newProduct)
    // this.props.addProduct(newProduct)
  }

  render () {
    const { state, close, handleSubmit } = this.props
    return (
      <Modal show={state.dialogOpen} onHide={close} className='add-product-dialog'>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchBar onSubmit={handleSubmit} submitting={state.isFetching} />
          {state.items.length ? (
            state.items.map(item =>
              <ListItem key={item._id} item={item} onSelect={this._addProduct} />
            )
          ) : (
            state.isFetching ? (
              <Alert bsStyle='warning'>Loading...</Alert>
            ) : (
              <Alert bsStyle='warning'>No items found.</Alert>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          Showing {state.items.length} of {state.totalCount} items.
        </Modal.Footer>
      </Modal>
    )
  }
}

AddProductDialog.propTypes = {
  handleSubmit : React.PropTypes.func.isRequired,
  state : React.PropTypes.object,
  close: React.PropTypes.func.isRequired,
  addProduct: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string.isRequired
}
export default AddProductDialog
