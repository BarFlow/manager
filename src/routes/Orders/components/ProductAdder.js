import React, { Component } from 'react'
import { Modal, Alert, Button, Panel, Pagination } from 'react-bootstrap'
import { Link } from 'react-router'

import ListItem from './ProductAdderListItem'
import SearchBar from '../../../containers/SearchBarContainer'
import { filterProductItems } from '../../Products/modules/products'

import './productAdder.scss'

class ProductAdder extends Component {
  constructor (props) {
    super(props)
    this.initialState = {
      filters: {},
      skip: 0,
      isConfirmDialogOpen: false,
      showAdded: false
    }
    this.state = this.initialState

    this._handleSearchBarChange = this._handleSearchBarChange.bind(this)
    this._handlePaginationSelect = this._handlePaginationSelect.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
    this._addToCart = this._addToCart.bind(this)
  }

  _addToCart (item) {
    this.props.addCartItems(item)
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
    const { products, reports, isFetching, onReportIdChange } = this.props
    const filteredItems = [...filterProductItems(products, this.state.filters)]
      .filter(item => {
        if (!this.state.showAdded) {
          return !item.added
        }
        return item
      })
    const belowParItems = filteredItems.filter(item => item.order >= 1 && !item.added)

    const batchAddConfirmDialog = <Modal show={this.state.isConfirmDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='add-confirm-dialog'>
      <Modal.Header closeButton><Modal.Title>Confirm</Modal.Title></Modal.Header>
      <Modal.Body>Are you sure that you want to add all {belowParItems.length} products to yor basket?</Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button bsStyle='danger' onClick={() => {
          this._addToCart(belowParItems)
          this._toggleConfirmDialog()
        }}>Yes</Button>
      </Modal.Footer>
    </Modal>

    return <Panel className='orders-create-product-adder'>
      {batchAddConfirmDialog}
      <div>
        <SearchBar
          filters={this.state.filters}
          onChange={this._handleSearchBarChange} />
      </div>
      {/* <div className='not-added'>
        <Checkbox
          inline
          checked={!this.state.showAdded}
          onChange={() => this.setState({ showAdded: !this.state.showAdded })}>
          Only show products which have not been added to the basket.
        </Checkbox>
      </div> */}
      <div>
        {filteredItems.length ? (
          <div className='items'>

            <div className='row add-low-pars'>
              {batchAddConfirmDialog}
              <div className='col-xs-12'>
                <label className='label-control'>Order products by par level based on</label>
                <select
                  onChange={(e) => onReportIdChange(e.currentTarget.value)}
                  className='form-control'
                  value={reports.currentReport._id || 'live'}
                  disabled={reports.isFetching}>
                  <option value='live'>current stock report</option>
                  {reports.archive.items.map((item, index) =>
                    <option key={index} value={item._id}>report created {item.created_at}</option>
                  )}
                </select>
                <Button onClick={this._toggleConfirmDialog} disabled={reports.isFetching || belowParItems.length === 0}>
                  Add {belowParItems.length} Items
                </Button>
              </div>
              <div className='col-xs-12 hint'>
                <span>{belowParItems.length}</span> products are below par level and not in your basket yet.
              </div>
            </div>

            {filteredItems.map(item =>
              <ListItem
                key={item._id}
                item={item}
                onSelect={this._addToCart} />
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
          isFetching ? (
            <Alert bsStyle='warning'>Loading...</Alert>
          ) : (
            <Alert bsStyle='warning'>
              No items found. You can easily add missing products to you venue <Link to='/products'>here</Link>.
            </Alert>
          )
        )}
      </div>
    </Panel>
  }
}

ProductAdder.propTypes = {
  addCartItems: React.PropTypes.func.isRequired,
  updateCartItem: React.PropTypes.func.isRequired,
  onReportIdChange: React.PropTypes.func.isRequired,
  products: React.PropTypes.array,
  reports: React.PropTypes.object,
  isFetching: React.PropTypes.bool
}

export default ProductAdder
