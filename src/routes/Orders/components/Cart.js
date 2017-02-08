import React, { Component } from 'react'
import { Panel } from 'react-bootstrap'

// import SupplierGroup from './CartSupplierGroup'

import './Cart.scss'

class Cart extends Component {
  render () {
    const { cart } = this.props.orders
    return (
      <Panel className='orders-create-cart'>
        {!!cart.length && cart.map(item =>
          <div key={item._id}>{item.product_id.name}</div>
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
