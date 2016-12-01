import React, { Component } from 'react'
import { Media, Panel, Button, Modal } from 'react-bootstrap'

class VenueListItem extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      isDialogOpen: false
    }

    this._handleDelete = this._handleDelete.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
  }

  _handleDelete () {
    this.props.deleteVenueItem({ type: `${this.props.currentType}s`, payload: this.props.item })
    this.setState({
      isDialogOpen:false
    })
  }

  _toggleConfirmDialog (e) {
    e.stopPropagation()
    this.setState({
      isDialogOpen: !this.state.isDialogOpen
    })
  }

  render () {
    const { name, inventory_item_id : inventoryItem = {} } = this.props.item
    const { item, onSelect } = this.props
    const product = inventoryItem.product_id || {}

    const listItemTitle = product.name || name

    const confirmDialog = <Modal show={this.state.isDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='delete-confirm-dialog'>

      <Modal.Header closeButton>
        <Modal.Title>Delete - {listItemTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to <strong>permanently remove {listItemTitle}</strong> from your venue?
        Please note that this action is irreversible.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button bsStyle='danger' onClick={this._handleDelete}>Delete</Button>
      </Modal.Footer>
    </Modal>

    return (
      <Panel onClick={() => { onSelect(item) }}>
        <Media>
          <Media.Body>
            <Media.Heading>{listItemTitle}</Media.Heading>
          </Media.Body>
          <Media.Right align='middle'>
            <div className='actions'>
              <Button>Edit</Button>
              <Button bsStyle='danger' onClick={this._toggleConfirmDialog}>Delete</Button>
              {confirmDialog}
            </div>
          </Media.Right>
        </Media>
      </Panel>
    )
  }
}

VenueListItem.propTypes = {
  item: React.PropTypes.object,
  updateVenueItem: React.PropTypes.func.isRequired,
  deleteVenueItem: React.PropTypes.func.isRequired,
  currentType: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func.isRequired
}
export default VenueListItem
