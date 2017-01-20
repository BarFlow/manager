import React, { Component } from 'react'
import { Modal, Alert, Button, Pagination, Checkbox } from 'react-bootstrap'
import { Link } from 'react-router'

import ListItem from './ListItem'
import SearchBar from '../../../../components/SearchBar'
import { filterProductItems } from '../../../Products/modules/products'

class PlacementAdder extends Component {
  constructor (props) {
    super(props)
    this.initialState = {
      filters: {},
      skip: 0,
      submitting: false,
      isConfirmDialogOpen: false,
      uniqueProducts: true
    }
    this.state = this.initialState

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

  _toggleConfirmDialog () {
    this.setState({
      isConfirmDialogOpen: !this.state.isConfirmDialogOpen
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

  render () {
    const { products, types, venue } = this.props
    const idsOfPlacements = venue.items.map(item => item.inventory_item_id._id)
    const filteredItems = [...filterProductItems(products.items, this.state.filters)]
    .filter(product => !this.state.uniqueProducts || idsOfPlacements.indexOf(product._id) === -1)
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

    return <div>
      {batchAddConfirmDialog}
      <Modal.Body>
        <SearchBar
          types={types}
          exclude={['suppliers']}
          filters={this.state.filters}
          onChange={this._handleSearchBarChange} />
        <div className='unique-products'>
          <Checkbox
            inline
            checked={this.state.uniqueProducts}
            onChange={() => this.setState({ uniqueProducts: !this.state.uniqueProducts })}>
            Only show products which have not been added to this section yet.
          </Checkbox>
        </div>
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
              <ListItem
                key={item._id}
                item={item}
                onSelect={() => this._addPlacement(item)}
                submitting={submitting} />
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
  }
}

PlacementAdder.propTypes = {
  venue: React.PropTypes.object,
  addVenueItem: React.PropTypes.func.isRequired,
  fetchProducts: React.PropTypes.func.isRequired,
  products: React.PropTypes.object,
  currentType: React.PropTypes.string.isRequired,
  venueId: React.PropTypes.string.isRequired,
  params: React.PropTypes.object.isRequired,
  fetchTypes: React.PropTypes.func.isRequired,
  types:React.PropTypes.object
}

export default PlacementAdder
