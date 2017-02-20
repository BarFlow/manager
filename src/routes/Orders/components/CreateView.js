import React, { Component } from 'react'
import _ from 'lodash'
import DatePicker from 'react-bootstrap-date-picker'
import { Modal, Button } from 'react-bootstrap'

import SubHeader from '../../../components/SubHeader'
import ProductAdder from './ProductAdder'
import Cart from './Cart'

import './CreateView.scss'

class CartView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isConfirmDialogOpen: false,
      orders: [],
      requestedDeliveyDate: new Date().toISOString()
    }
    this._handleOrderCreation = this._handleOrderCreation.bind(this)
    this._handleCartSubmission = this._handleCartSubmission.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
    this._handleDeliveryDateChange = this._handleDeliveryDateChange.bind(this)
  }
  componentDidMount () {
    const { products, fetchProducts, reports, fetchReport, emptyCart, venueId } = this.props

    // Fetch products if needed
    if (
      (!products.items.length && !products.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && products.items.length && venueId !== products.items[0].venue_id)
    ) {
      fetchProducts(venueId)
      emptyCart()
    }

    // Fetch reports if needed
    if (
      (!reports.items.length && !reports.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && reports.items.length && venueId !== reports.items[0].venue_id)
    ) {
      fetchReport({ venueId, reportId: 'live' })
      emptyCart()
    }
  }

  componentWillReceiveProps (nextProps) {
    const { fetchProducts, fetchReport, emptyCart, venueId } = this.props
    if (nextProps.venueId !== venueId) {
      fetchProducts(nextProps.venueId)
      fetchReport({ venueId: nextProps.venueId, reportId: 'live' })
      emptyCart()
    }
  }

  _handleCartSubmission (payload) {
    this._toggleConfirmDialog()
    this.setState({
      orders: payload
    })
  }

  _handleOrderCreation () {
    const payload = this.state.orders.map(order => ({
      ...order,
      req_delivery_date: this.state.requestedDeliveyDate
    }))
    this.props.createOrder(payload)
      .then(() => this.props.router.push({ pathname: '/orders/archive', query: { saved: true } }))
  }

  _toggleConfirmDialog () {
    this.setState({
      isConfirmDialogOpen: !this.state.isConfirmDialogOpen
    })
  }

  _handleDeliveryDateChange (value) {
    this.setState({
      requestedDeliveyDate: value
    })
  }

  render () {
    // products + reports items
    // const mergedProducts = this.props.products.items.reduce((mem, product) => {
    //   // Check if product is found in report
    //   const match = mem.find(item => item._id === product._id) || {}
    //   // Check if item is in cart already
    //   const cartMatch = this.props.orders.cart.find(item => item._id === product._id)
    //
    //   match.added = !!cartMatch
    //   match.order = cartMatch && cartMatch.order || match.order
    //   match.supplier_id = match.supplier_id && match.supplier_id._id
    //
    //   if (!match._id) {
    //     mem.push({
    //       ...product,
    //       order: cartMatch && cartMatch.order || 0,
    //       added: !!cartMatch
    //     })
    //   }
    //   return mem
    // }, [...this.props.reports.items])

    // TODO Temp fix, using only reportItems (products with no placements are NOT in this list)
    // Problem is that we don't have supplier populated in normal GET /inventory models
    const mergedProducts = [...this.props.reports.items].map(reportItem => {
      const cartMatch = this.props.orders.cart.find(item => item._id === reportItem._id)
      return {
        ...reportItem,
        cost_price: reportItem.cost_price || 0,
        ammount: cartMatch && cartMatch.ammount || reportItem.order,
        added: !!cartMatch
      }
    })

    const confirmDialog = <Modal show={this.state.isConfirmDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='delete-confirm-dialog'>
      <Modal.Header closeButton>
        <Modal.Title>Delivery Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Please set a requested delivery date for your orders:</p>
        <DatePicker
          onChange={this._handleDeliveryDateChange}
          value={this.state.requestedDeliveyDate}
          dateFormat={'DD/MM/YYYY'} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button
          bsStyle='primary'
          onClick={this._handleOrderCreation}
          disabled={this.props.orders.isSaving}>
          {(this.props.orders.isSaving) ? 'Loading...' : 'Submit'}
        </Button>
      </Modal.Footer>
    </Modal>

    return (
      <div className='row orders'>
        <SubHeader
          className='bg-green'
          left={<h3>Orders / <span className='small'>Create</span></h3>} />
        <div className='col-xs-12 col-sm-7 col-lg-6 col-lg-offset-1'>
          {confirmDialog}
          <ProductAdder
            products={_.orderBy(mergedProducts, ['product_id.category', 'product_id.sub_category'])}
            addCartItems={this.props.addCartItems}
            updateCartItem={this.props.updateCartItem}
            isFetching={this.props.products.isFetching || this.props.reports.isFetching} />
        </div>
        <div className='col-xs-12 col-sm-5 col-lg-4'>
          <Cart
            deleteCartItem={this.props.deleteCartItem}
            updateCartItem={this.props.updateCartItem}
            onSubmit={this._handleCartSubmission}
            venueId={this.props.venueId}
            orders={this.props.orders} />
        </div>
      </div>
    )
  }
}

CartView.propTypes = {
  orders: React.PropTypes.object.isRequired,
  products: React.PropTypes.object.isRequired,
  fetchProducts: React.PropTypes.func.isRequired,
  reports: React.PropTypes.object.isRequired,
  fetchReport: React.PropTypes.func.isRequired,
  addCartItems: React.PropTypes.func.isRequired,
  updateCartItem: React.PropTypes.func.isRequired,
  deleteCartItem: React.PropTypes.func.isRequired,
  emptyCart: React.PropTypes.func.isRequired,
  createOrder: React.PropTypes.func.isRequired,
  router: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string
}

export default CartView
