import React, { Component } from 'react'

class CartView extends Component {
  // constructor (props) {
  //   super(props)
  //
  // }

  componentDidMount () {
    const { products, fetchProducts, reports, fetchReport, venueId } = this.props

    // Fetch products if needed
    if (
      (!products.items.length && !products.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && products.items.length && venueId !== products.items[0].venue_id)
    ) {
      fetchProducts(venueId)
    }

    // Fetch reports if needed
    if (
      (!reports.items.length && !reports.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && reports.items.length && venueId !== reports.items[0].venue_id)
    ) {
      fetchReport({ venueId, reportId: 'live' })
    }
  }

  componentWillReceiveProps (nextProps) {
    const { fetchProducts, fetchReport, venueId } = this.props
    if (nextProps.venueId !== venueId) {
      fetchProducts(nextProps.venueId)
      fetchReport({ venueId: nextProps.venueId, reportId: 'live' })
    }
  }

  render () {
    return (
      <div>Orders Cart View</div>
    )
  }
}

CartView.propTypes = {
  products: React.PropTypes.object.isRequired,
  fetchProducts: React.PropTypes.func.isRequired,
  reports: React.PropTypes.object.isRequired,
  fetchReport: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string
}

export default CartView
