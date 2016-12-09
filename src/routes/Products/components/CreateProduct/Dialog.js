import React from 'react'
import { Modal } from 'react-bootstrap'

import CreateProduct from './CreateProductContainer'

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
  close: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired
}

export default CreateDialog
