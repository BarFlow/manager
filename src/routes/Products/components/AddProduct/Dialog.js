import React from 'react'
import { Modal } from 'react-bootstrap'

import AddProduct from './AddProduct'

const AddProductDialog = (props) => {
  return (
    <Modal show={props.isOpen} onHide={props.close} className='add-product-dialog'>
      <Modal.Header closeButton>
        <Modal.Title>Create Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddProduct {...props} />
      </Modal.Body>
    </Modal>
  )
}

AddProductDialog.propTypes = {
  close: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired
}

export default AddProductDialog
