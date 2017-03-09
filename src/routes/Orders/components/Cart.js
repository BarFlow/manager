import React, { Component } from 'react'
import { Panel, Modal, Button } from 'react-bootstrap'
import _ from 'lodash'

import SupplierGroup from './CartSupplierGroup'

import './Cart.scss'

class Cart extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isConfirmDialogOpen: false
    }

    this._handleOnSubmit = this._handleOnSubmit.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
  }

  _handleOnSubmit () {
    const { onSubmit, venueId } = this.props
    const groupedItems = _.groupBy(this.props.orders.cart, 'supplier_id._id')
    const payload = Object.keys(groupedItems).map((key, index) => ({
      venue_id: venueId,
      supplier_id: groupedItems[key].length && groupedItems[key][0].supplier_id && groupedItems[key][0].supplier_id._id,
      items: groupedItems[key].map(item => ({
        inventory_item: {
          _id: item._id,
          product_id: {
            name: item.product_id.name,
            type: item.product_id.type,
            category: item.product_id.category,
            sub_category: item.product_id.sub_category
          },
          supplier_product_code: item.supplier_product_code,
          cost_price: item.cost_price
        },
        ammount: item.ammount
      }))
    }))
    onSubmit(payload)
  }

  _toggleConfirmDialog () {
    this.setState({
      isConfirmDialogOpen: !this.state.isConfirmDialogOpen
    })
  }

  render () {
    const groupedItems = _.groupBy(this.props.orders.cart, 'supplier_id._id')
    const summary = this.props.orders.cart.reduce((mem, item) => {
      const price = item.cost_price * item.ammount
      return {
        total: Math.round((mem.total + price) * 100) / 100,
        vat: Math.round((mem.total + price) * 0.2 * 100) / 100,
        grandTotal: Math.round((mem.total + price) * 1.2 * 100) / 100
      }
    }, { total: 0, vat: 0, grandTotal: 0 })

    const confirmDialog = <Modal show={this.state.isConfirmDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='empty-cart-confirm-dialog'>
      <Modal.Header closeButton>
        <Modal.Title>Empty Basket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to empty your basket?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button
          bsStyle='danger'
          onClick={() => {
            this.props.emptyCart()
            this._toggleConfirmDialog()
          }}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>

    return (
      <div className='orders-create-cart'>
        <Panel>
          {!this.props.orders.cart.length &&
            <div className='empty'>Basket is empty</div>
          }
          {Object.keys(groupedItems).map((key, index) =>
            <SupplierGroup
              key={index}
              supplier={groupedItems[key].length && groupedItems[key][0].supplier_id}
              items={groupedItems[key].length &&
                _.orderBy(groupedItems[key], ['product_id.category', 'product_id.sub_category', 'product_id.name'])}
              deleteCartItem={this.props.deleteCartItem}
              updateCartItem={this.props.updateCartItem} />
          )}
          <div className='summary'>
            <div className='total'>
              Total <div className='pull-right'>£{summary.total}</div>
            </div>
            <div className='total-vat'>
              VAT <div className='pull-right'>£{summary.vat}</div>
            </div>
            <div className='grand-total'>
              Grand Total <div className='pull-right'>£{summary.grandTotal}</div>
            </div>
          </div>
          <div className='create-orders'>
            <button
              onClick={this._handleOnSubmit}
              disabled={this.props.orders.isSaving || !this.props.orders.cart.length}>
              {(this.props.orders.isSaving) ? 'Loading...' : 'Create Orders'}
            </button>
          </div>
        </Panel>
        <div className='empty-cart'>
          {confirmDialog}
          {!!this.props.orders.cart.length &&
            <Button
              bsStyle='danger'
              bsSize='xsmall'
              onClick={this._toggleConfirmDialog}>Empty Basket</Button>
          }
        </div>
      </div>
    )
  }
}

Cart.propTypes = {
  deleteCartItem: React.PropTypes.func.isRequired,
  updateCartItem: React.PropTypes.func.isRequired,
  emptyCart: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string,
  orders: React.PropTypes.object
}

export default Cart
