import React, { Component } from 'react'
import { Button, Alert, Panel, Pagination } from 'react-bootstrap'
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc'

import SubHeader from '../../../components/SubHeader'
import AddVenueItemDialog from './AddVenueItemDialog'
import VenueListItem from './VenueListItem'

import './venue.scss'

class venue extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isAddNewDialogOpen: false,
      skip: 0
    }

    this._openItem = this._openItem.bind(this)
    this._navigateBack = this._navigateBack.bind(this)
    this._getCurrentType = this._getCurrentType.bind(this)
    this._onSortEnd = this._onSortEnd.bind(this)
    this._toggleAddNewDialog = this._toggleAddNewDialog.bind(this)
    this._handlePaginationSelect = this._handlePaginationSelect.bind(this)
  }

  componentDidMount () {
    const { venueId, fetchVenueItems } = this.props
    // Fetch products if there is venueId
    if (venueId) {
      fetchVenueItems(this._getFilters(this.props))
    }
  }

  componentWillReceiveProps (nextProps) {
    // Fetch new items if the venue has been changed, like in sidebar selectors
    if (this.props.venueId && this.props.venueId !== nextProps.venueId) {
      this.props.router.push({
        pathname: '/venue'
      })
    }

    // Fetch new items if new params received so basically when the URL has changed
    if (this.props.params !== nextProps.params) {
      this.props.fetchVenueItems(this._getFilters(nextProps))
    }

    // Fetch items when venueId is first received
    if (!this.props.venueId && this.props.venueId !== nextProps.venueId) {
      this.props.fetchVenueItems(this._getFilters(nextProps))
    }
  }

  _getFilters (props) {
    const { params } = props
    if (params.section_id) {
      return {
        type: 'placements',
        filterKey: 'section_id',
        filterValue: `${params.section_id}&populate=true`
      }
    }
    if (params.area_id) {
      return {
        type: 'sections',
        filterKey: 'area_id',
        filterValue: params.area_id
      }
    }
    return {
      type: 'areas',
      filterKey: 'venue_id',
      filterValue: props.venueId
    }
  }

  _getCurrentType () {
    const { params } = this.props
    if (params.section_id) {
      return 'placements'
    }
    if (params.area_id) {
      return 'sections'
    }
    return 'areas'
  }

  _openItem (item) {
    const { router, params, venueId } = this.props
    let pathname = '/venue'
    let query = {}
    if (params.area_id) {
      pathname += '/' + params.area_id
      query = {
        section: item.name
      }
    } else {
      query = {
        area: item.name
      }
    }
    this.setState({ skip: 0 })
    router.push({
      pathname: pathname + '/' + item._id,
      query: {
        venue_id: venueId,
        ...router.location.query,
        ...query
      }
    })
  }

  _navigateBack () {
    const { router, params } = this.props
    let pathname = '/venue'
    let query = {}
    if (params.section_id) {
      pathname += '/' + params.area_id
      query.area = router.location.query.area
    }
    this.setState({ skip: 0 })
    router.push({
      pathname,
      query
    })
  }

  _onSortEnd ({ oldIndex, newIndex }) {
    const { items } = this.props.venue
    const sortedItems = arrayMove(items, oldIndex + this.state.skip, newIndex + this.state.skip)
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

  _handlePaginationSelect (page) {
    this.setState({
      skip: (20 * (page - 1))
    })
    window.scrollTo(0, 0)
  }

  render () {
    const {
      venue,
      venueId,
      updateVenueItem,
      deleteVenueItem,
      addVenueItem,
      fetchProducts,
      products,
      fetchTypes,
      types,
      router,
      params,
      venueName
    } = this.props
    const { area, section } = router.location.query

    const SortableItem = SortableElement(({ item }) =>
      <VenueListItem
        key={item._id}
        item={item}
        onSelect={this._openItem}
        currentType={this._getCurrentType()}
        updateVenueItem={updateVenueItem}
        deleteVenueItem={deleteVenueItem}
        sortableHandle={SortableHandle} />
    )

    const VenueList = SortableContainer(() =>
      <div>
        {[...venue.items].splice(this.state.skip, 21).map((item, index) =>
          <SortableItem key={`item-${index}`} index={index} item={item} />
        )}
      </div>
    )

    const currentTitle = section || area
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
                onClick={this._toggleAddNewDialog}>Add {(
                  this._getCurrentType() === 'placements'
                    ? 'product'
                    : this._getCurrentType().slice(0, -1)
                )}</Button>
              {venueId &&
                <AddVenueItemDialog
                  isOpen={this.state.isAddNewDialogOpen}
                  addVenueItem={addVenueItem}
                  products={products}
                  fetchProducts={fetchProducts}
                  types={types}
                  fetchTypes={fetchTypes}
                  params={params}
                  venue={venue}
                  venueId={venueId}
                  currentType={this._getCurrentType()}
                  close={this._toggleAddNewDialog} />
              }
            </div>
          } />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 venue'>
          {(area || section) &&
            <Panel className='breadcrumbs' onClick={this._navigateBack}>
              <h4>{'❮ '}{(section ? area : section) || venueName}</h4>
            </Panel>
          }
          <div className='items'>
            {!venueId || venue.isFetching ? (
              <Alert bsStyle='warning'>Loading...</Alert>
            ) : (
              venue.items.length ? (
                <div>
                  <VenueList onSortEnd={this._onSortEnd} useDragHandle useWindowAsScrollContainer />
                  {venue.items.length > 20 &&
                  <div className='pagination-container text-center'>
                    <Pagination ellipsis boundaryLinks
                      items={Math.ceil(venue.items.length / 20)}
                      maxButtons={5}
                      activePage={(this.state.skip / 20) + 1}
                      onSelect={this._handlePaginationSelect} />
                  </div>
                  }
                </div>
              ) : (
                <Alert bsStyle='warning'>No {this._getCurrentType() === 'placements'
                  ? 'product'
                  : this._getCurrentType().slice(0, -1)} found.</Alert>
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
