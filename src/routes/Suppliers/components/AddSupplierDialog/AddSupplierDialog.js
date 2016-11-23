import React, { Component } from 'react'
import { Modal, Alert } from 'react-bootstrap'
import CreateNew from './CreateNew'
import ListItem from './ListItem'
import './AddSupplierDialog.scss'

class AddSupplierDialog extends Component {
  constructor (props) {
    super(props)
    this._addSupplier = this._addSupplier.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.state.dialogOpen && !this.props.state.dialogOpen) {
      this.props.fetchCatalog()
    }
  }

  _addSupplier (item) {
    const supplier = {
      ...item,
      _id: undefined,
      venue_id: this.props.venueId
    }
    this.props.addSupplier(supplier)
  }

  render () {
    const { state, close } = this.props
    const items = state.items.filter(item => !item.venue_id)
    return (
      <Modal show={state.dialogOpen} onHide={close} className='add-supplier-dialog'>
        <Modal.Header closeButton>
          <Modal.Title>Add Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateNew onSubmit={this._addSupplier} submitting={state.isFetching} />
        </Modal.Body>
        <Modal.Footer>
          {items.length ? (
            items.map(item => <ListItem key={item._id} item={item} onSelect={this._addSupplier} />
          )
        ) : (
          state.isFetching ? (
            <Alert bsStyle='warning'>Loading...</Alert>
          ) : (
            <Alert bsStyle='warning'>No items found.</Alert>
          )
        )}
        </Modal.Footer>
      </Modal>
    )
  }
}

AddSupplierDialog.propTypes = {
  state : React.PropTypes.object,
  close: React.PropTypes.func.isRequired,
  addSupplier: React.PropTypes.func.isRequired,
  fetchCatalog: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string.isRequired
}
export default AddSupplierDialog
