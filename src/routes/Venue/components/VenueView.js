import React, { Component } from 'react'
import { Button, Alert } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
// import AddVenueDialog from './AddVenueDialog'
import VenueListItem from './VenueListItem'

import './venue.scss'

class venue extends Component {
  componentDidMount () {
    const { venueId, venue, fetchVenueItems } = this.props
    // Fetch products if there is new venueId or no products in store yet
    if (
      (venueId && !venue.items.length) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && venueId !== venue.items[0].venue_id)
    ) {
      fetchVenueItems({ type: 'areas', filterKey: 'venue_id', filterValue: this.props.venueId })
    }
  }

  componentWillReceiveProps (nextProps) {
    // Only fetch new products for new venue_id
    if (this.props.venueId !== nextProps.venueId) {
      this.props.fetchVenueItems({ type: 'areas', filterKey: 'venue_id', filterValue: nextProps.venueId })
    }
  }

  render () {
    const {
      venue, venueId, updateVenueItem, deleteVenueItem
    } = this.props

    const VenueList = venue.items.map(item =>
      <VenueListItem
        key={item._id}
        item={item}
        updateVenueItem={updateVenueItem}
        deleteVenueItem={deleteVenueItem} />
    )

    return (
      <div className='row'>
        <SubHeader
          className='bg-green'
          left={<h3>venue</h3>}
          right={
            <div>
              <Button disabled={!venueId}>Add new</Button>
            </div>
          } />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 products'>

          <div className='items'>
            {!venueId || venue.isFetching ? (
              <Alert bsStyle='warning'>Loading...</Alert>
            ) : (
              venue.items.length ? (
                VenueList
              ) : (
                <Alert bsStyle='warning'>No items found.</Alert>
              )
            )}
          </div>

        </div>

      </div>
    )
  }
}

venue.propTypes = {
  fetchVenueItems: React.PropTypes.func.isRequired,
  addVenueItem: React.PropTypes.func.isRequired,
  updateVenueItem: React.PropTypes.func.isRequired,
  batchUpdateVenueItems: React.PropTypes.func.isRequired,
  deleteVenueItem: React.PropTypes.func.isRequired,
  toggleAddNewDialog: React.PropTypes.func.isRequired,
  venue: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string
}
export default venue
