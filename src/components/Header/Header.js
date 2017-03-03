import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router'
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap'
import './Header.scss'

import logoImg from './assets/logo.svg'

export const Header = ({ user, handleLogOut }) => (
  <Navbar collapseOnSelect fixedTop fluid>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to='/'><img src={logoImg} alt='logo' /></Link>
      </Navbar.Brand>
      {user &&
        <Navbar.Toggle />
      }
    </Navbar.Header>
    {user &&
    <Navbar.Collapse>
      <Nav pullRight>
        <NavDropdown eventKey={1} title={
          <span><span className='glyphicon glyphicon-user' /> {user.name}</span>
        } id='basic-nav-dropdown'>
          <LinkContainer to='/profile'><MenuItem eventKey={1.1}>Profile</MenuItem></LinkContainer>
          <LinkContainer to='/venues'><MenuItem eventKey={1.2}>Venues</MenuItem></LinkContainer>
          <MenuItem divider />
          <MenuItem eventKey={1.3} onSelect={handleLogOut}>Log out</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
    }
  </Navbar>
)

Header.propTypes = {
  user : React.PropTypes.object,
  handleLogOut: React.PropTypes.func.isRequired
}
export default Header
