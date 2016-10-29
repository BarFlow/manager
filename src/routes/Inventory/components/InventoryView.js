import React from 'react'
import DuckImage from '../assets/Duck.jpg'
import './InventoryView.scss'
import SubHeader from '../../../components/SubHeader'

export const InventoryView = () => (
  <div>
    <SubHeader className='col-sm-offset-3 col-md-offset-2'>
      <h3>Inventory</h3>
    </SubHeader>
    <div className='main'>
      <h4>Welcome!</h4>
      <img
        alt='This is a duck, because Redux!'
        className='duck'
        src={DuckImage} />
    </div>
  </div>
)

export default InventoryView
