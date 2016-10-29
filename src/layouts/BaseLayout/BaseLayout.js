import React from 'react'
import Header from '../../containers/HeaderContainer'
import './BaseLayout.scss'
import '../../styles/core.scss'

export const BaseLayout = ({ children }) => (
  <div>
    <Header />
    <div className='container-fluid base-layout'>
      <div className='content'>
        {children}
      </div>
    </div>
  </div>
)

BaseLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default BaseLayout
