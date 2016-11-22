import React, { Component } from 'react'
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
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
          <IndexLinkContainer to='/inventory' activeHref='active'>
            <NavItem>Inventory</NavItem>
          </IndexLinkContainer>
          <LinkContainer to='/products' activeHref='active'>
            <NavItem>Products</NavItem>
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
