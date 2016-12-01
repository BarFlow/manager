import React, { Component } from 'react'
import { Modal, Alert } from 'react-bootstrap'
import CreateNew from './CreateNew'
import ListItem from './ListItem'
import './AddVenueDialog.scss'

class AddVenueDialog extends Component {
  constructor (props) {
    super(props)
    this._addVenue = this._addVenue.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.state.dialogOpen && !this.props.state.dialogOpen) {
      this.props.fetchCatalog()
    }
  }

  _addVenue (item) {
    const venue = {
      ...item,
      _id: undefined,
      venue_id: this.props.venueId
    }
    this.props.addVenue(venue)
  }

  render () {
    const { state, close } = this.props
    const items = state.items.filter(item => !item.venue_id)
    return (
      <Modal show={state.dialogOpen} onHide={close} className='add-venue-dialog'>
        <Modal.Header closeButton>
          <Modal.Title>Add Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateNew onSubmit={this._addVenue} submitting={state.isFetching} />
        </Modal.Body>
        <Modal.Footer>
          {items.length ? (
            items.map(item => <ListItem key={item._id} item={item} onSelect={this._addVenue} />
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

AddVenueDialog.propTypes = {
  state : React.PropTypes.object,
  close: React.PropTypes.func.isRequired,
  addVenue: React.PropTypes.func.isRequired,
  fetchCatalog: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string.isRequired
}
export default AddVenueDialog
