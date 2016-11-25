import React from 'react'
import './ArchiveView.scss'
import SubHeader from '../../../components/SubHeader'

export const ArchiveView = ({ params }) => {
  return <div className='row'>
    <SubHeader
      className='bg-blue'
      left={<h3>Inventory</h3>} />
    <div className='col-xs-12'>
      Archive view
    </div>
  </div>
}

ArchiveView.propTypes = {
  params: React.PropTypes.object
}

export default ArchiveView
