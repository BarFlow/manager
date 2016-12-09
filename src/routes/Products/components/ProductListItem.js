import React, { Component } from 'react'
import { Media, Label, Panel, Button, Collapse, Modal } from 'react-bootstrap'
import castNullToStr from '../../../utils/castNullToStr'
import ProductListItemForm from './ProductListItemForm'

class ProductListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isFormOpen: false,
      isClosing: false,
      isDialogOpen: false
    }

    this._toggleCollapse = this._toggleCollapse.bind(this)
    this._handleDelete = this._handleDelete.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
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
      isDialogOpen:false
    })
  }

  _toggleConfirmDialog () {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen
    })
  }

  render () {
    const { name, type, category, sub_category: subCategory, capacity, images } = this.props.item.product_id

    const confirmDialog = <Modal show={this.state.isDialogOpen}
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
            <Media.Heading>{name}</Media.Heading>
            <p>
              <Label>{type}</Label>{' '}
              <Label>{category}</Label>{' '}
              {subCategory &&
                <span>
                  <Label>{subCategory}</Label>{' '}
                </span>
              }
              <Label>{capacity} ml</Label>
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
                      product_id: undefined
                    }}
                    suppliers={this.props.suppliers}
                    onSubmit={this.props.updateProduct}
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
  item: React.PropTypes.shape({
    _id: React.PropTypes.string.isRequired,
    product_id: React.PropTypes.shape({
      _id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      category: React.PropTypes.string.isRequired,
      sub_category: React.PropTypes.string,
      capacity: React.PropTypes.number.isRequired,
      images: React.PropTypes.object
    })
  }),
  suppliers: React.PropTypes.object.isRequired,
  updateProduct: React.PropTypes.func.isRequired,
  deleteProduct: React.PropTypes.func.isRequired
}
export default ProductListItem
