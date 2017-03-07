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
  isOpen: React.PropTypes.bool.isRequired,
  close: React.PropTypes.func.isRequired,
  currentType: React.PropTypes.string.isRequired
}

export default AddVenueItemDialog
