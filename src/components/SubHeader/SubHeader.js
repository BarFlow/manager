import React from 'react'
// import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
// import { Nav, NavItem } from 'react-bootstrap'
import './SubHeader.scss'

export const Sidebar = ({ children, className }) => (
  <div className={className + ' sub-header'}>
    {children}
  </div>
)

Sidebar.propTypes = {
  children : React.PropTypes.element.isRequired,
  className : React.PropTypes.string
}
export default Sidebar
