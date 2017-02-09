import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'
import _ from 'lodash'

import SupplierGroup from './CartSupplierGroup'

import './Cart.scss'

class Cart extends Component {
  render () {
    const groupedItems = _.groupBy(this.props.orders.cart, 'supplier_id._id')

    return (
      <Panel className='orders-create-cart'>
        {Object.keys(groupedItems).map((key, index) =>
          <SupplierGroup
            key={index}
            supplier={groupedItems[key].length && groupedItems[key][0].supplier_id}
            items={groupedItems[key].length && groupedItems[key]}
            deleteCartItem={this.props.deleteCartItem}
            updateCartItem={this.props.updateCartItem} />
        )}
      </Panel>
    )
  }
}

Cart.propTypes = {
  deleteCartItem: React.PropTypes.func.isRequired,
  updateCartItem: React.PropTypes.func.isRequired,
  orders: React.PropTypes.object
}

export default Cart
