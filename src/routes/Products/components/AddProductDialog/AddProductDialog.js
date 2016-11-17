import React, { Component } from 'react'
import { Modal, Alert } from 'react-bootstrap'
import SearchBar from './SearchBar'

class AddProductDialog extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.props.handleSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.state.dialogOpen && !this.props.state.dialogOpen) {
      this.props.handleSubmit()
    }
  }

  render () {
    const { state, close, handleSubmit } = this.props
    return (
      <Modal show={state.dialogOpen} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchBar onSubmit={handleSubmit} submitting={state.isFetching} />
          {state.items.length ? (
            state.items.map(item =>
              <div key={item._id}>{item.name}</div>
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
          Total of {state.totalCount} products found.
        </Modal.Footer>
      </Modal>
    )
  }
}

AddProductDialog.propTypes = {
  handleSubmit : React.PropTypes.func.isRequired,
  state : React.PropTypes.object,
  close: React.PropTypes.func.isRequired
}
export default AddProductDialog
