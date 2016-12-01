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
    this.props.deleteVenueItem(this.props.item)
    this.setState({
      isDialogOpen:false
    })
  }

  _toggleConfirmDialog () {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen
    })
  }

  render () {
    const { name } = this.props.item

    const confirmDialog = <Modal show={this.state.isDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='delete-confirm-dialog'>

      <Modal.Header closeButton>
        <Modal.Title>Delete - {name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to <strong>permanently remove {name}</strong> from your venue?
        Please note that this action is irreversible.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button bsStyle='danger' onClick={this._handleDelete}>Delete</Button>
      </Modal.Footer>
    </Modal>

    return (
      <Panel>
        <Media>
          <Media.Body>
            <Media.Heading>{name}</Media.Heading>
          </Media.Body>
          <Media.Right>
            <Button>Edit</Button>
            <Button onClick={this._toggleConfirmDialog}>Delete</Button>
            {confirmDialog}
          </Media.Right>
        </Media>
      </Panel>
    )
  }
}

VenueListItem.propTypes = {
  item: React.PropTypes.object,
  updateVenueItem: React.PropTypes.func.isRequired,
  deleteVenueItem: React.PropTypes.func.isRequired
}
export default VenueListItem
