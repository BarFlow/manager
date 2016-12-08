import React from 'react'
import { Modal } from 'react-bootstrap'

import CreateProduct from './CreateProduct'

const CreateDialog = (props) => {
  return (
    <Modal show={props.isOpen} onHide={props.close} className='create-product-dialog'>
      <Modal.Header closeButton>
        <Modal.Title>Create Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CreateProduct {...props} />
      </Modal.Body>
    </Modal>
  )
}

CreateDialog.propTypes = {
  venueId: React.PropTypes.string.isRequired,
  types: React.PropTypes.object,
  fetchTypes: React.PropTypes.func.isRequired,
  createProduct: React.PropTypes.func.isRequired,
  close: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired
}

export default CreateDialog
