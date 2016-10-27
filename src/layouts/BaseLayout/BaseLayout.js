import React from 'react'
import Header from '../../containers/HeaderContainer'
import './BaseLayout.scss'
import '../../styles/core.scss'

export const BaseLayout = ({ children }) => (
  <div className='container container-fluid base-layout'>
    <Header />
    <div className='container content'>
      {children}
    </div>
  </div>
)

BaseLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default BaseLayout
