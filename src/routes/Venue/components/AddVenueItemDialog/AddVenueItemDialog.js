import React, { Component } from 'react'
import { Modal, Alert, ControlLabel, FormControl, Button, Pagination } from 'react-bootstrap'
import { Link } from 'react-router'

import ListItem from './ListItem'
import './AddVenueItemDialog.scss'
import SearchBar from '../../../../components/SearchBar'
import { filterProductItems } from '../../../Products/modules/products'

class AddVenueItemDialog extends Component {
  constructor (props) {
    super(props)
    this.initialState = {
      name: '',
      filters: {},
      skip: 0,
      submitting: false,
      isConfirmDialogOpen: false
    }
    this.state = this.initialState

    this._addVenueItem = this._addVenueItem.bind(this)
    this._close = this._close.bind(this)
    this._handleSearchBarChange = this._handleSearchBarChange.bind(this)
    this._handlePaginationSelect = this._handlePaginationSelect.bind(this)
    this._batchAddPlacements = this._batchAddPlacements.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
  }

  componentDidMount () {
    const { types = { items:[] }, fetchTypes, products = { items:[] }, fetchProducts, venueId } = this.props
    if (!types.items.length && !types.isFetching) {
      fetchTypes()
    }
    if (!products.items.length && !products.isFetching) {
      fetchProducts(venueId)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.venueId !== nextProps.venueId) {
      this.props.fetchProducts(nextProps.venueId)
    }
  }

  _addVenueItem (e) {
    e.preventDefault()
    const { currentType, venueId, venue, params } = this.props

    if (!this.state.name.length) {
      return
    }

    this.props.addVenueItem({
      type: currentType === 'placements' ? 'placements?populate=true' : currentType,
      payload: {
        venue_id: venueId,
        area_id: params.area_id,
        section_id: params.section_id,
        order: venue.items.length,
        name: this.state.name
      }
    })

    this._close()
  }

  _addPlacement (item) {
    const { venueId, venue, params } = this.props
    this.setState({
      submitting: true
    })
    this.props.addVenueItem({
      type: 'placements?populate=true',
      payload: {
        venue_id: venueId,
        area_id: params.area_id,
        section_id: params.section_id,
        order: venue.items.length,
        inventory_item_id: item._id
      }
    })
    .then((r) => this.setState({
      submitting: false
    }))
  }

  _batchAddPlacements (items) {
    const { venueId, venue, params } = this.props
    this.setState({
      submitting: true
    })
    this.props.addVenueItem({
      type: 'placements?populate=true',
      payload: items.map((item, index) => ({
        venue_id: venueId,
        area_id: params.area_id,
        section_id: params.section_id,
        order: (venue.items.length + index),
        inventory_item_id: item._id
      }))
    })
    .then((r) => this.setState({
      submitting: false
    }))
  }

  _handleSearchBarChange (filters) {
    this.setState({
      filters,
      skip: 0
    })
  }

  _handlePaginationSelect (page) {
    this.setState({
      skip: (20 * (page - 1))
    })
    window.scrollTo(0, 0)
  }

  _close () {
    this.setState(this.initialState)
    this.props.close()
  }

  _toggleConfirmDialog () {
    this.setState({
      isConfirmDialogOpen: !this.state.isConfirmDialogOpen
    })
  }

  render () {
    const { products = { items: [] }, isOpen, currentType, types } = this.props
    const filteredItems = [...filterProductItems(products.items, this.state.filters)]
    const { submitting } = this.state

    const batchAddConfirmDialog = <Modal show={this.state.isConfirmDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='add-confirm-dialog'>
      <Modal.Header closeButton><Modal.Title>Confirm</Modal.Title></Modal.Header>
      <Modal.Body>Are you sure that you want to add all {filteredItems.length} products to this section?</Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button bsStyle='danger' onClick={() => {
          this._batchAddPlacements(filteredItems)
          this._toggleConfirmDialog()
        }}>Yes</Button>
      </Modal.Footer>
    </Modal>

    const addAreaOrSectionForm = <form onSubmit={this._addVenueItem}>
      <Modal.Body>
        <ControlLabel>Name</ControlLabel>
        <FormControl
          autoFocus
          autoComplete='off'
          type='text'
          value={this.state.name}
          placeholder='Name'
          onChange={(e) => { this.setState({ name: e.currentTarget.value }) }} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._close}>Cancel</Button>
        <Button bsStyle='primary' type='submit'>Add</Button>
      </Modal.Footer>
    </form>

    const addPlacement = <div>
      <Modal.Body>
        <SearchBar
          types={types}
          exclude={['suppliers']}
          filters={this.state.filters}
          onChange={this._handleSearchBarChange} />
      </Modal.Body>
      <Modal.Footer>
        {filteredItems.length ? (
          <div className='items'>

            {filteredItems.length > 1 &&
            <div className='row add-all'>
              <div className='col-xs-12 col-sm-9'>
                There are <span>{filteredItems.length}</span> products found,
                you can add them to this section all at once using this button.
              </div>
              <div className='col-xs-12 col-sm-3 text-right'>
                <Button onClick={this._toggleConfirmDialog} disabled={submitting}>
                  Add {filteredItems.length} Items
                </Button>
                {batchAddConfirmDialog}
              </div>
            </div>
            }

            {filteredItems.map(item =>
              <ListItem key={item._id} item={item} onSelect={() => this._addPlacement(item)} submitting={submitting} />
            ).splice(this.state.skip, 20)}

            {filteredItems.length > 20 &&
            <div className='pagination-container text-center'>
              <Pagination ellipsis boundaryLinks
                items={Math.ceil(filteredItems.length / 20)}
                maxButtons={5}
                activePage={(this.state.skip / 20) + 1}
                onSelect={this._handlePaginationSelect} />
            </div>
            }
          </div>
        ) : (
          products.isFetching ? (
            <Alert bsStyle='warning'>Loading...</Alert>
          ) : (
            <Alert bsStyle='warning'>
              No items found. You can easily add missing products to you venue <Link to='/products'>here</Link>.
            </Alert>
          )
        )}
      </Modal.Footer>
    </div>

    return (
      <Modal show={isOpen} onHide={this._close} className={'add-venue-item-dialog ' + currentType}>
        <Modal.Header closeButton>
          <Modal.Title>Add {currentType === 'placements'
            ? 'product'
            : currentType.slice(0, -1)}</Modal.Title>
        </Modal.Header>
        {currentType === 'placements' ? (
          addPlacement
        ) : (
          addAreaOrSectionForm
        )}
      </Modal>
    )
  }
}

AddVenueItemDialog.propTypes = {
  venue: React.PropTypes.object,
  isOpen: React.PropTypes.bool.isRequired,
  close: React.PropTypes.func.isRequired,
  addVenueItem: React.PropTypes.func.isRequired,
  fetchProducts: React.PropTypes.func.isRequired,
  products: React.PropTypes.object,
  currentType: React.PropTypes.string.isRequired,
  venueId: React.PropTypes.string.isRequired,
  params: React.PropTypes.object.isRequired,
  fetchTypes: React.PropTypes.func.isRequired,
  types:React.PropTypes.object
}
export default AddVenueItemDialog
