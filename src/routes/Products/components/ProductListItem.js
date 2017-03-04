import React, { Component } from 'react'
import { Media, Label, Panel, Button, Collapse, Modal } from 'react-bootstrap'
import castNullToStr from '../../../utils/castNullToStr'
import ProductListItemForm from './ProductListItemForm'

import CreateProductDialog from './CreateProduct/Dialog'

class ProductListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFormOpen: false,
      isClosing: false,
      isConfirmDialogOpen: false,
      isCreateDialogOpen: false
    }

    this._toggleCollapse = this._toggleCollapse.bind(this)
    this._handleDelete = this._handleDelete.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
    this._toggleCreateProductDialog = this._toggleCreateProductDialog.bind(this)
    this._forkProductIfNeeded = this._forkProductIfNeeded.bind(this)
  }

  _toggleCollapse () {
    if (this.state.isFormOpen) {
      this.state.isClosing = true
      setTimeout(() => this.setState({ isClosing: false }), 300)
    }
    this.setState({ isFormOpen: !this.state.isFormOpen })
  }

  _handleDelete () {
    this.props.deleteProduct(this.props.item)
    this.setState({
      isConfirmDialogOpen:false
    })
  }

  _toggleConfirmDialog () {
    this.setState({
      isConfirmDialogOpen: !this.state.isConfirmDialogOpen
    })
  }

  _toggleCreateProductDialog () {
    this.setState({
      isCreateDialogOpen: !this.state.isCreateDialogOpen
    })
  }

  _forkProductIfNeeded (action) {
    // Product has been forked
    if (action.type === 'products/CATALOG_ADD_SUCCESS') {
      this.props.updateProduct({
        _id: this.props.item._id,
        product_id: action.payload._id
      })
    }
  }

  render () {
    const {
      name,
      category,
      sub_category: subCategory,
      capacity,
      images
    } = this.props.item.product_id

    const {
      package_size: caseSize,
      cost_price: costPrice,
      par_level: parLevel,
      supplier_product_code: sku,
      supplier_id: supplierId
    } = this.props.item

    const selectedSupplier = this.props.suppliers.items.find(item => item._id === supplierId)

    const confirmDialog = <Modal show={this.state.isConfirmDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='delete-product-dialog'>

      <Modal.Header closeButton>
        <Modal.Title>Delete - {name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to <strong>permanently remove {name}</strong> from your venue?
        Please note that this action is irreversible.</p>
        <p className='product'><img src={images.normal} /></p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button bsStyle='danger' onClick={this._handleDelete}>Delete</Button>
      </Modal.Footer>
    </Modal>

    return (
      <Panel>
        <Media>
          <Media.Left>
            <div>
              <img src={images && images.thumbnail} alt={name} />
            </div>
          </Media.Left>
          <Media.Body>
            <Media.Heading>
              {name}{' '}
              {this.state.isFormOpen &&
                <Button className='update' bsSize='xsmall' onClick={this._toggleCreateProductDialog}>Edit</Button>
              }
              {this.state.isCreateDialogOpen &&
                <CreateProductDialog
                  isOpen
                  initialValues={this.props.item.product_id}
                  close={this._toggleCreateProductDialog}
                  onSubmit={this._forkProductIfNeeded}
                  />
              }
            </Media.Heading>
            <p>
              <Label>{category}</Label>
              {subCategory && subCategory !== 'other' &&
                <Label>{subCategory}</Label>
              }
              <Label>{capacity} ml</Label>
              <Label>{costPrice && `£ ${costPrice}`}</Label>
              {!!parLevel && <Label>Par level: {parLevel}</Label>}
              <Label>{selectedSupplier && selectedSupplier.name}</Label>
              <Label bsStyle='danger'>
                {!sku && 'SKU'}
              </Label>
              <Label bsStyle='danger'>
                {!selectedSupplier && 'Supplier'}
              </Label>
              <Label bsStyle='danger'>
                {!costPrice && 'Price'}
              </Label>
              <Label bsStyle='danger'>
                {(!parLevel && parLevel !== 0) && 'Par level'}
              </Label>
              <Label bsStyle='danger'>
                {!caseSize && 'Case size'}
              </Label>
            </p>
          </Media.Body>
          <Media.Right>
            <Button onClick={this._toggleCollapse}>
              {!this.state.isFormOpen ? (
                'Edit'
              ) : (
                'Done'
              )}
            </Button>
          </Media.Right>
          <Collapse in={this.state.isFormOpen}>
            <div>
              <hr />
              {(this.state.isFormOpen || this.state.isClosing) &&
                <div>
                  <ProductListItemForm
                    form={this.props.item._id}
                    initialValues={{
                      ...castNullToStr(this.props.item),
                      product_id: undefined,
                      count_as_full: this.props.item.count_as_full * 100
                    }}
                    enableReinitialize
                    suppliers={this.props.suppliers}
                    onSubmit={(values) => {
                      return this.props.updateProduct({
                        ...values,
                        count_as_full: values.count_as_full / 100,
                        supplier_product_code: values.supplier_product_code.toString()
                      })
                    }}
                    handleDelete={this._toggleConfirmDialog} />
                  {confirmDialog}
                </div>
              }
            </div>
          </Collapse>
        </Media>
      </Panel>
    )
  }
}

ProductListItem.propTypes = {
  item: React.PropTypes.object.isRequired,
  suppliers: React.PropTypes.object.isRequired,
  updateProduct: React.PropTypes.func.isRequired,
  deleteProduct: React.PropTypes.func.isRequired
}
export default ProductListItem
