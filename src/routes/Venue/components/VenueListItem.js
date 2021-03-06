import React, { Component } from 'react'
import { Media, Panel, Button, Modal, ControlLabel, FormControl } from 'react-bootstrap'

import sortIcon from '../assets/sortable.png'
import editIcon from '../assets/edit.png'
import removeIcon from '../assets/remove.png'

class VenueListItem extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      isConfirmDialogOpen: false,
      isRenameDialogOpen: false,
      name: this.props.item.name || ''
    }

    this._handleDelete = this._handleDelete.bind(this)
    this._handleRename = this._handleRename.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
    this._toggleRenameDialog = this._toggleRenameDialog.bind(this)
  }

  _handleDelete () {
    this.props.deleteVenueItem({ type: this.props.currentType, payload: this.props.item })
    this.setState({
      isConfirmDialogOpen: false
    })
  }

  _handleRename (e) {
    e && e.preventDefault()
    this.props.updateVenueItem({
      type: this.props.currentType,
      payload: {
        ...this.props.item,
        name: this.state.name
      }
    })
    this.setState({
      isRenameDialogOpen: false
    })
  }

  _toggleConfirmDialog (e) {
    e && e.stopPropagation()
    this.setState({
      isConfirmDialogOpen: !this.state.isConfirmDialogOpen
    })
  }

  _toggleRenameDialog (e) {
    e && e.stopPropagation()
    this.setState({
      isRenameDialogOpen: !this.state.isRenameDialogOpen
    })
  }

  render () {
    const { name, inventory_item_id : inventoryItem = {} } = this.props.item
    const { item, onSelect, sortableHandle, currentType } = this.props
    const product = inventoryItem.product_id || {}
    const listItemTitle = product.name || name

    const DragHandle = sortableHandle(() =>
      <button className='sort'><img draggable='false' src={sortIcon} /></button>)

    const confirmDialog = <Modal show={this.state.isConfirmDialogOpen}
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

    const renameDialog = <Modal show={this.state.isRenameDialogOpen}
      onHide={this._toggleRenameDialog}
      className='rename-dialog'>

      <Modal.Header closeButton>
        <Modal.Title>Rename - {listItemTitle}</Modal.Title>
      </Modal.Header>
      <form onSubmit={this._handleRename}>
        <Modal.Body>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            autoFocus
            autoComplete='off'
            type='text'
            value={this.state.name}
            placeholder='Name'
            onChange={(e) => { this.setState({ name: e.currentTarget.value }) }} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this._toggleRenameDialog}>Cancel</Button>
          <Button bsStyle='primary' type='submit'>Rename</Button>
        </Modal.Footer>
      </form>
    </Modal>

    return (
      <Panel
        onClick={() => { !product.name && onSelect(item) }}
        className={'venue-list-item ' + currentType} >
        <Media>
          {product.name &&
            <Media.Left align='middle'>
              <div>
                <img src={product.images && product.images.thumbnail} alt={name} />
              </div>
            </Media.Left>
          }
          <Media.Body>
            <Media.Heading>{listItemTitle}</Media.Heading>
          </Media.Body>
          <Media.Right align='middle'>
            <div className='actions'>
              <DragHandle />
              {!product.name &&
                <button onClick={this._toggleRenameDialog} className='button edit'><img src={editIcon} /></button>
              }
              <button onClick={this._toggleConfirmDialog} className='button remove'><img src={removeIcon} /></button>
              {confirmDialog}
              {renameDialog}
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
  sortableHandle: React.PropTypes.func.isRequired,
  currentType: React.PropTypes.string.isRequired,
  onSelect: React.PropTypes.func.isRequired
}
export default VenueListItem
