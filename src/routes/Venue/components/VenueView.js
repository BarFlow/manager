import React, { Component } from 'react'
import { Button, Alert, Panel } from 'react-bootstrap'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'

import SubHeader from '../../../components/SubHeader'
import AddVenueItemDialog from './AddVenueItemDialog'
import VenueListItem from './VenueListItem'

import './venue.scss'

class venue extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isAddNewDialogOpen: false
    }

    this._updatePath = this._updatePath.bind(this)
    this._getCurrentType = this._getCurrentType.bind(this)
    this._onSortEnd = this._onSortEnd.bind(this)
    this._toggleAddNewDialog = this._toggleAddNewDialog.bind(this)
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
      this.props.updatePath({
        area: {},
        section: {}
      })
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

  _onSortEnd ({ oldIndex, newIndex }) {
    const { items } = this.props.venue
    const sortedItems = arrayMove(items, oldIndex, newIndex)
    const payload = sortedItems.map((item, index) => {
      return {
        _id: item._id,
        venue_id: item.venue_id,
        order: index,
        updated_at: new Date()
      }
    })
    this.props.batchUpdateVenueItems({
      type: this._getCurrentType(),
      payload,
      sortedItems
    })
  }

  _toggleAddNewDialog () {
    this.setState({
      isAddNewDialogOpen: !this.state.isAddNewDialogOpen
    })
  }

  render () {
    const {
      venue,
      venueId,
      updateVenueItem,
      deleteVenueItem,
      updatePath,
      addVenueItem,
      fetchProducts,
      products,
      fetchTypes,
      types,
      venueName
    } = this.props
    const { area, section } = venue.path

    const SortableItem = SortableElement(({ item }) =>
      <VenueListItem
        key={item._id}
        item={item}
        onSelect={this._updatePath}
        currentType={this._getCurrentType()}
        updateVenueItem={updateVenueItem}
        deleteVenueItem={deleteVenueItem}
        sortableHandle={SortableHandle} />
    )

    const VenueList = SortableContainer(() => {
      return (
        <div>
          {venue.items.map((item, index) =>
            <SortableItem key={`item-${index}`} index={index} item={item} />
          )}
        </div>
      )
    })

    const currentTitle = section.name ? section.name : area.name
    return (
      <div className='row'>
        <SubHeader
          className='bg-green'
          left={
            <h3>Venue {currentTitle && '/ '}<span className='small'>{currentTitle}</span></h3>}
          right={
            <div>
              <Button
                disabled={!venueId}
                onClick={this._toggleAddNewDialog}>Add {this._getCurrentType().slice(0, -1)}</Button>
              {venueId &&
                <AddVenueItemDialog
                  isOpen={this.state.isAddNewDialogOpen}
                  addVenueItem={addVenueItem}
                  products={products}
                  fetchProducts={fetchProducts}
                  types={types}
                  fetchTypes={fetchTypes}
                  venue={venue}
                  venueId={venueId}
                  currentType={this._getCurrentType()}
                  close={this._toggleAddNewDialog} />
              }
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
              <h4>{'❮ '}{(section._id ? area.name : section.name) || venueName}</h4>
            </Panel>
          }
          <div className='items'>
            {!venueId || venue.isFetching ? (
              <Alert bsStyle='warning'>Loading...</Alert>
            ) : (
              venue.items.length ? (
                <VenueList onSortEnd={this._onSortEnd} useDragHandle />
              ) : (
                <Alert bsStyle='warning'>No {this._getCurrentType()} found.</Alert>
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
  updatePath: React.PropTypes.func.isRequired,
  fetchProducts: React.PropTypes.func.isRequired,
  products: React.PropTypes.object,
  fetchTypes: React.PropTypes.func.isRequired,
  types: React.PropTypes.object,
  params: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired,
  venue: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string,
  venueName: React.PropTypes.string
}
export default venue
