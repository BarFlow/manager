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
      skip: 0
    }
    this.state = this.initialState

    this._addVenueItem = this._addVenueItem.bind(this)
    this._close = this._close.bind(this)
    this._handleSearchBarChange = this._handleSearchBarChange.bind(this)
    this._handlePaginationSelect = this._handlePaginationSelect.bind(this)
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

  render () {
    const { products = { items: [] }, isOpen, currentType, types } = this.props
    const filteredItems = [...filterProductItems(products.items, this.state.filters)]

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
            {filteredItems.map(item =>
              <ListItem key={item._id} item={item} onSelect={() => this._addPlacement(item)} />
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
          <Modal.Title>Add {currentType.slice(0, -1)}</Modal.Title>
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
