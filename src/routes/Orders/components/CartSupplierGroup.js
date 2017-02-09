import React from 'react'
import { Button, Label } from 'react-bootstrap'

export const CartSupplierGroup = ({ supplier = { name: 'Supplier' }, items, deleteCartItem, updateCartItem }) => (
  <div>
    <h4>{supplier.name}</h4>
    {items.map((item, index) =>
      <div key={index}>
        <div>
          {item.ammount} x {item.product_id.name}
          {item.cost_price &&
            <Label>
              {item.ammount} x £{item.cost_price}
              {' '}(£{Math.round(item.cost_price * item.ammount * 100) / 100})
            </Label>
          }
        </div>
        <div>
          <input
            className='form-control'
            type='number'
            value={item.ammount}
            onChange={(e) => updateCartItem({
              ...item,
              ammount: parseInt(e.currentTarget.value, 10) > 1 ? parseInt(e.currentTarget.value, 10) : 1
            })} />
          <Button bsStyle='danger' onClick={() => deleteCartItem(item)}>Delete</Button>
        </div>
      </div>
    )}
  </div>
)

CartSupplierGroup.propTypes = {
  supplier: React.PropTypes.object,
  items: React.PropTypes.array,
  deleteCartItem: React.PropTypes.func.isRequired,
  updateCartItem: React.PropTypes.func.isRequired
}

export default CartSupplierGroup
