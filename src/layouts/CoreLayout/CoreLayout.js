import React from 'react'
import './CoreLayout.scss'
import '../../styles/core.scss'
import Sidebar from '../../components/Sidebar'

export const CoreLayout = ({ children }) => (
  <div className='row core-layout'>
    <Sidebar className='col-sm-3 col-md-2' />
    <div className='col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2'>
      {children}
    </div>
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
