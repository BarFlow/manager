import React from 'react'
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem } from 'react-bootstrap'
import './Sidebar.scss'

export const Sidebar = ({ user, handleLogOut, className }) => (
  <div className={className + ' sidebar'}>
    <Nav>
      <IndexLinkContainer to='/inventory' activeHref='active'>
        <NavItem>Inventory</NavItem>
      </IndexLinkContainer>
      <LinkContainer to='/profile' activeHref='active'>
        <NavItem>Products</NavItem>
      </LinkContainer>
    </Nav>
  </div>
)

Sidebar.propTypes = {
  user : React.PropTypes.object,
  handleLogOut: React.PropTypes.func.isRequired,
  className: React.PropTypes.string
}
export default Sidebar
