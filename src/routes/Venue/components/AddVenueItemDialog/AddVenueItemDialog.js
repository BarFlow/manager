import React, { Component } from 'react'
import { Modal, Alert, ControlLabel, FormControl, Button } from 'react-bootstrap'

import ListItem from './ListItem'
import './AddVenueItemDialog.scss'
import SearchBar from '../../../../components/SearchBar'
import { filterProductItems } from '../../../Products/modules/products'

class AddVenueItemDialog extends Component {
  constructor (props) {
    super(props)
    this.initialState = {
      name: '',
      filters: {}
    }
    this.state = this.initialState

    this._addVenueItem = this._addVenueItem.bind(this)
    this._close = this._close.bind(this)
    this._handleSearchBarChange = this._handleSearchBarChange.bind(this)
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

  _addVenueItem (e, item) {
    e && e.preventDefault()
    const { currentType, venueId, venue } = this.props
    this.props.addVenueItem({
      type: currentType === 'placements' ? 'placements?populate=true' : currentType,
      payload: {
        venue_id: venueId,
        area_id: venue.path.area._id,
        section_id: venue.path.section._id,
        order: venue.items.length,
        inventory_item_id: item && item._id,
        ...this.state
      }
    })
    currentType !== 'placements' && this._close()
  }

  _handleSearchBarChange (filters) {
    this.setState({
      filters
    })
  }

  _close () {
    this.setState(this.initialState)
    this.props.close()
  }

  render () {
    const { products = { items: [] }, isOpen, currentType, types } = this.props
    const items = [...filterProductItems(products.items, this.state.filters)].splice(0, 20)

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
        {items.length ? (
          items.map(item =>
            <ListItem key={item._id} item={item} onSelect={() => this._addVenueItem(null, item)} />
        )
      ) : (
        products.isFetching ? (
          <Alert bsStyle='warning'>Loading...</Alert>
        ) : (
          <Alert bsStyle='warning'>No items found.</Alert>
        )
      )}
      </Modal.Footer>
    </div>

    return (
      <Modal show={isOpen} onHide={this._close} className={'add-venue-item-dialog ' + currentType}>
        <Modal.Header closeButton>
          <Modal.Title>Add Item</Modal.Title>
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
  fetchTypes: React.PropTypes.func.isRequired,
  types:React.PropTypes.object
}
export default AddVenueItemDialog
