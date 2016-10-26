import React from 'react'
import { IndexLink } from 'react-router'
import './Header.scss'

export const Header = () => (
  <div>
    <nav className='navbar navbar-full navbar-fixed-top'>
      <IndexLink to='/' className='navbar-brand'>BarFlow Manager</IndexLink>
    </nav>
  </div>
)

export default Header
