import React, { Component } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, FormControl } from 'react-bootstrap'
import './Sidebar.scss'

class Sidebar extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.fetchVenues = this.props.fetchVenues.bind(this)
    this.handleVenueChange = this.props.handleVenueChange.bind(this)
  }

  componentDidMount () {
    if (!this.props.venues.items.length) {
      this.fetchVenues()
    }

    if (this.props.location && this.props.location.query.venue_id) {
      this.handleVenueChange(this.props.location.query.venue_id)
    }
  }

  componentWillReceiveProps (newProps) {
    const { venue_id: venueId } = this.props.location.query
    const { newVenueId } = newProps.location.query
    if (newVenueId && venueId !== newVenueId) {
      this.handleVenueChange(newVenueId)
    }
  }

  render () {
    const { className = '', venues = { items:[] }, handleVenueChange } = this.props
    const venueItems = venues.items.map(item =>
      <option key={item._id} value={item._id}>
        {item.profile.name}
      </option>
    )

    const inventorySubItemsHidden = location.pathname.match(/^\/inventory/) ? '' : 'hidden'

    return (
      <div className={className + ' sidebar'}>
        <div className='venue'>
          <FormControl
            componentClass='select'
            onChange={(event) => handleVenueChange(event.target.value)}
            value={venues.current || ''}>
            {venueItems}
          </FormControl>
        </div>
        <Nav>
          <LinkContainer to='/inventory' activeHref='active'>
            <NavItem>Inventory</NavItem>
          </LinkContainer>
          <LinkContainer to='/inventory/reports/live' activeHref='active'>
            <NavItem className={`sub ${inventorySubItemsHidden}`}>Live</NavItem>
          </LinkContainer>
          <LinkContainer to='/inventory/archive' activeHref='active'>
            <NavItem className={`sub ${inventorySubItemsHidden}`}>Archive</NavItem>
          </LinkContainer>
          <LinkContainer to='/products' activeHref='active'>
            <NavItem>Products</NavItem>
          </LinkContainer>
          <LinkContainer to='/suppliers' activeHref='active'>
            <NavItem>Suppliers</NavItem>
          </LinkContainer>
        </Nav>
      </div>
    )
  }
}

Sidebar.propTypes = {
  venues : React.PropTypes.object,
  location : React.PropTypes.object,
  fetchVenues: React.PropTypes.func.isRequired,
  handleVenueChange: React.PropTypes.func.isRequired,
  className: React.PropTypes.string
}
export default Sidebar
