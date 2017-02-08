import React, { Component } from 'react'
import { Modal } from 'react-bootstrap'

import PlacementAdder from './PlacementAdder'
import AreaOrSectionAdder from './AreaOrSectionAdder'

import './AddVenueItemDialog.scss'

class AddVenueItemDialog extends Component {
  render () {
    const { isOpen, close, currentType } = this.props

    return (
      <Modal show={isOpen} onHide={close} className={'add-venue-item-dialog ' + currentType}>
        <Modal.Header closeButton>
          <Modal.Title>Add {currentType === 'placements'
            ? 'product'
            : currentType.slice(0, -1)}</Modal.Title>
        </Modal.Header>
        {currentType === 'placements' ? (
          <PlacementAdder {...this.props} />
        ) : (
          <AreaOrSectionAdder {...this.props} />
        )}
      </Modal>
    )
  }
}

AddVenueItemDialog.propTypes = {
  venue: React.PropTypes.object,
  isOpen: React.PropTypes.bool.isRequired,
  close: React.PropTypes.func.isRequired,
  addVenueItem: React.PropTypes.func.isRequired,
  fetchProducts: React.PropTypes.func.isRequired,
  products: React.PropTypes.object,
  currentType: React.PropTypes.string.isRequired,
  venueId: React.PropTypes.string.isRequired,
  params: React.PropTypes.object.isRequired
}

export default AddVenueItemDialog
