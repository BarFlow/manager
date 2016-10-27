import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'

export const Header = ({ user, handleLogOut }) => (
  <div>
    <nav className='navbar navbar-full navbar-fixed-top'>
      <IndexLink to='/' className='navbar-brand'>BarFlow Manager</IndexLink>
      {user &&
        <div>
          <Link to='/counter'>Counter</Link>
          {user.name}
          <a onClick={handleLogOut}> Logout</a>
        </div>
      }
    </nav>
  </div>
)

Header.propTypes = {
  user : React.PropTypes.object,
  handleLogOut: React.PropTypes.func.isRequired
}
export default Header
