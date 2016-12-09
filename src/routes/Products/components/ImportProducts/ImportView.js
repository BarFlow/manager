import React, { Component } from 'react'

import SubHeader from '../../../../components/SubHeader'
import ProductParser from './ProductParser'
import ProductAdder from './ProductAdder'

import './ImportProducts.scss'

class ImportView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      items: [],
      currentIndex: 0
    }

    this._handleParse = this._handleParse.bind(this)
    this._handleProductAdd = this._handleProductAdd.bind(this)
  }

  componentDidMount () {
    const { venueId, suppliers, fetchSuppliers } = this.props
    if (venueId && !suppliers.items.length) {
      fetchSuppliers(venueId)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { venueId, fetchSuppliers } = this.props
    // Fetch new suppliers
    if (venueId !== nextProps.venueId) {
      fetchSuppliers(nextProps.venueId)
    }
  }

  _handleParse (items) {
    this.setState({
      items
    })
  }

  _handleProductAdd (values) {
    // Import product if values are sent
    if (values) {
      return this.props.addProduct({
        venue_id: this.props.venueId,
        ...values
      }).then(() =>
        this.setState({
          currentIndex: this.state.currentIndex + 1
        })
      )
    }
    // Skip product
    this.setState({
      currentIndex: this.state.currentIndex + 1
    })
  }

  render () {
    return (
      <div className='row'>
        <SubHeader
          className='bg-yellow'
          left={<h3>Products <span className='small'>/ Import</span></h3>} />
        <div className='col-xs-12 col-sm-10 col-sm-offset-1 product-import'>
          {!this.state.items.length
            ? <ProductParser onParse={this._handleParse} />
            : <ProductAdder
              onSubmit={this._handleProductAdd}
              product={this.state.items[this.state.currentIndex]}
              suppliers={this.props.suppliers}
              percent={Math.round((this.state.currentIndex / this.state.items.length * 100))}
              catalog={this.props.products.catalog}
              fetchCatalog={this.props.fetchCatalog}
              veuneId={this.props.venueId} />
          }
        </div>
      </div>
    )
  }
}

ImportView.propTypes = {
  fetchProducts: React.PropTypes.func.isRequired,
  fetchTypes: React.PropTypes.func.isRequired,
  fetchCatalog: React.PropTypes.func.isRequired,
  fetchSuppliers: React.PropTypes.func.isRequired,
  addProduct: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string,
  products : React.PropTypes.object,
  types: React.PropTypes.object,
  suppliers: React.PropTypes.object
}
export default ImportView
