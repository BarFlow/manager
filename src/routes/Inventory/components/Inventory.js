import React from 'react'
import { Button } from 'react-bootstrap'
import './Inventory.scss'
import SubHeader from '../../../components/SubHeader'

export const Inventory = ({ children }) => (
  <div className='row'>
    <SubHeader
      className='bg-blue'
      left={<h3>Inventory</h3>}
      right={<Button>Export</Button>} />
    <div className='col-xs-12'>
      {children}
    </div>
  </div>
)

Inventory.propTypes = {
  children: React.PropTypes.element
}

export default Inventory
