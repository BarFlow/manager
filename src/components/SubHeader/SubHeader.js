import React from 'react'
// import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
// import { Nav, NavItem } from 'react-bootstrap'
import './SubHeader.scss'

export const SubHeader = ({ left, right, className = '' }) => (
  <div className={className + ' sub-header'}>
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-xs-12 col-sm-6 left'>{left}</div>
        <div className='col-xs-12 col-sm-6 right'>{right}</div>
      </div>
    </div>
  </div>
)

SubHeader.propTypes = {
  left : React.PropTypes.element.isRequired,
  right : React.PropTypes.element,
  className : React.PropTypes.string
}
export default SubHeader
