import React from 'react'
import { Button } from 'react-bootstrap'

export const CartSupplierGroup = ({
  supplier = { name: 'Supplier not set' },
  items,
  deleteCartItem,
  updateCartItem
}) => {
  let subTotal = 0
  return <div className='supplier-group'>
    <h4>{supplier.name}</h4>
    {items.map((item, index) => {
      const price = Math.round(item.cost_price * item.ammount * 100) / 100
      subTotal = Math.round((subTotal + price) * 100) / 100
      return <div key={index} className='cart-item'>
        <span className='info'>{item.ammount} x {item.product_id.name}</span>{' '}
        {item.cost_price !== undefined &&
          <span className='price'>
            {' '}£{price}
          </span>
        }
        <div className='actions'>
          <input
            className='form-control'
            type='number'
            value={item.ammount}
            onChange={(e) => updateCartItem({
              ...item,
              ammount: parseInt(e.currentTarget.value, 10) > 1 ? parseInt(e.currentTarget.value, 10) : 1
            })} />
          <Button bsStyle='danger' bsSize='small' onClick={() => deleteCartItem(item)}>Remove</Button>
        </div>
      </div>
    }
  )}
    <div className='sub-total'>
      <span className='info'>Subtotal</span>
      <span className='price'>£{subTotal}</span>
    </div>
  </div>
}

CartSupplierGroup.propTypes = {
  supplier: React.PropTypes.object,
  items: React.PropTypes.array,
  deleteCartItem: React.PropTypes.func.isRequired,
  updateCartItem: React.PropTypes.func.isRequired
}

export default CartSupplierGroup
