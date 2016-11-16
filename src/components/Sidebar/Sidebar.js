import React, { Component } from 'react'
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap'
import { Nav, NavItem, FormGroup, FormControl } from 'react-bootstrap'
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
        <FormGroup>
          <FormControl
            componentClass='select'
            onChange={(event) => handleVenueChange(event.target.value)}
            value={venues.current || ''}>
            {venueItems}
          </FormControl>
        </FormGroup>
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
  fetchVenues: React.PropTypes.func.isRequired,
  handleVenueChange: React.PropTypes.func.isRequired,
  className: React.PropTypes.string
}
export default Sidebar
