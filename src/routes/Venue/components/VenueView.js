import React, { Component } from 'react'
import { Button, Alert, Panel } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
// import AddVenueDialog from './AddVenueDialog'
import VenueListItem from './VenueListItem'

import './venue.scss'

class venue extends Component {
  constructor (props) {
    super(props)

    this._updatePath = this._updatePath.bind(this)
    this._getCurrentType = this._getCurrentType.bind(this)
  }

  componentDidMount () {
    const { venueId, fetchVenueItems } = this.props
    // Fetch products if there is venueId
    if (venueId) {
      fetchVenueItems(this._getFilters(this.props))
    }
  }

  componentWillReceiveProps (nextProps) {
    // Fetch new items for new venue_id
    if (this.props.venueId !== nextProps.venueId) {
      this.props.fetchVenueItems(this._getFilters(nextProps))
    }

    if (this.props.venue.path.area !== nextProps.venue.path.area) {
      this.props.fetchVenueItems(this._getFilters(nextProps))
    }

    if (this.props.venue.path.section !== nextProps.venue.path.section) {
      this.props.fetchVenueItems(this._getFilters(nextProps))
    }
  }

  componentWillUnmount () {
    this.props.updatePath({
      area: {},
      section: {}
    })
  }

  _getFilters (props) {
    const path = props.venue.path
    if (path.section._id) {
      return {
        type: 'placements',
        filterKey: 'section_id',
        filterValue: `${path.section._id}&populate=true`
      }
    }
    if (path.area._id) {
      return {
        type: 'sections',
        filterKey: 'area_id',
        filterValue: path.area._id
      }
    }
    return {
      type: 'areas',
      filterKey: 'venue_id',
      filterValue: props.venueId
    }
  }

  _getCurrentType () {
    const path = this.props.venue.path
    if (path.section._id) {
      return 'placements'
    }
    if (path.area._id) {
      return 'sections'
    }
    return 'areas'
  }

  _updatePath (item) {
    let payload = {}
    if (this.props.venue.path.area._id) {
      payload = {
        section: item
      }
    } else {
      payload = {
        area: item
      }
    }
    this.props.updatePath(payload)
  }

  render () {
    const {
      venue, venueId, updateVenueItem, deleteVenueItem, updatePath
    } = this.props
    const { area, section } = venue.path

    const VenueList = venue.items.map(item =>
      <VenueListItem
        key={item._id}
        item={item}
        onSelect={this._updatePath}
        currentType={this._getCurrentType()}
        updateVenueItem={updateVenueItem}
        deleteVenueItem={deleteVenueItem} />
    )

    return (
      <div className='row'>
        <SubHeader
          className='bg-green'
          left={
            <h3>Venue / <span className='small'>{this._getCurrentType()}</span></h3>}
          right={
            <div>
              <Button disabled={!venueId}>Add new</Button>
            </div>
          } />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 venue'>
          {(area._id || section._id) &&
            <Panel className='breadcrumbs' onClick={() => {
              updatePath({
                area: section.name ? area : {},
                section: {}
              })
            }}>
              <h4>{'❮ '}{section.name ? section.name : area.name}</h4>
            </Panel>
          }
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
  updatePath: React.PropTypes.func.isRequired,
  params: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired,
  venue: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string
}
export default venue
