import React from 'react'
import { Button } from 'react-bootstrap'
import DuckImage from '../assets/Duck.jpg'
import './Inventory.scss'
import SubHeader from '../../../components/SubHeader'

export const Inventory = () => (
  <div className='row'>
    <SubHeader
      left={<h3>Inventory</h3>}
      right={<Button>Export</Button>} />
    <div className='col-xs-12'>
      <h4>Welcome!</h4>
      <img
        alt='This is a duck, because Redux!'
        className='duck'
        src={DuckImage} />
    </div>
  </div>
)

export default Inventory
