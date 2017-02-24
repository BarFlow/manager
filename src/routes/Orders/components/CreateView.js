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
    this._handleReportIdChange = this._handleReportIdChange.bind(this)
  }
  componentDidMount () {
    const {
      products,
      fetchProducts,
      reports,
      fetchReport,
      fetchReports,
      venueId
    } = this.props

    // Fetch products if needed
    if (
      (!products.items.length && !products.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && products.items.length && venueId !== products.items[0].venue_id)
    ) {
      fetchProducts(venueId)
    }

    // Fetch reports
    if (venueId) {
      fetchReport({ venueId, reportId: 'live' })
    }

    if (
      (!reports.archive.items.length && !reports.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && reports.archive.items.length && venueId !== reports.archive.items[0].venue_id)
    ) {
      fetchReports(venueId)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { fetchProducts, fetchReport, fetchReports, emptyCart, venueId } = this.props
    if (nextProps.venueId !== venueId) {
      fetchProducts(nextProps.venueId)
      fetchReport({ venueId: nextProps.venueId, reportId: nextProps.reports.currentReport._id || 'live' })
      fetchReports(nextProps.venueId)
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

  _handleReportIdChange (reportId) {
    // Silent fetch new report
    return this.props.fetchReport({ venueId: this.props.venueId, reportId })
  }

  render () {
    const mergedProducts = this.props.reports.currentReport.data.reduce((mem, item) => {
      const product = mem.find(orderItem => orderItem._id === item._id)
      if (product) {
        product.order = item.order
        product.supplier_id = item.supplier_id
        product.ammount = product.ammount ? product.ammount : item.order
      }
      return mem
    }, this.props.products.items.map(productItem => {
      const cartMatch = this.props.orders.cart.find(item => item._id === productItem._id)
      return {
        ...productItem,
        cost_price: productItem.cost_price || 0,
        ammount: cartMatch && cartMatch.ammount,
        added: !!cartMatch
      }
    }))

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
            reports={this.props.reports}
            addCartItems={this.props.addCartItems}
            updateCartItem={this.props.updateCartItem}
            isFetching={this.props.products.isFetching}
            onReportIdChange={this._handleReportIdChange} />
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
  fetchReports: React.PropTypes.func.isRequired,
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
