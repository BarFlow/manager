import React, { Component } from 'react'
import { Alert } from 'react-bootstrap'

import SubHeader from '../../../../components/SubHeader'
import ProductParser from './ProductParser'
import ProductAdder from './ProductAdder'

import './ImportProducts.scss'

class ImportView extends Component {
  constructor (props) {
    super(props)

    this.state = {
      items: [],
      currentIndex: 0,
      success: false
    }

    this._handleParse = this._handleParse.bind(this)
    this._handleProductAdd = this._handleProductAdd.bind(this)
    this._handleProductUpdate = this._handleProductUpdate.bind(this)
    this._next = this._next.bind(this)
  }

  componentDidMount () {
    const { venueId, suppliers, fetchSuppliers, products, fetchProducts } = this.props
    if ((venueId && !suppliers.items.length) || (venueId && !products.items.length)) {
      fetchSuppliers(venueId)
      fetchProducts(venueId)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { venueId, fetchSuppliers, fetchProducts } = this.props
    // Fetch new suppliers
    if (venueId !== nextProps.venueId) {
      fetchSuppliers(nextProps.venueId)
      fetchProducts(nextProps.venueId)
    }
  }

  _handleParse (items) {
    this.setState({
      items
    })
  }

  _handleProductAdd (values) {
    return this.props.addProduct({
      venue_id: this.props.venueId,
      ...values
    }).then(() =>
      this._next()
    )
  }

  _handleProductUpdate (values) {
    return this.props.updateProduct({
      venue_id: this.props.venueId,
      ...values
    }).then(() =>
      this._next()
    )
  }

  _next () {
    const nextIndex = this.state.items[this.state.currentIndex + 1] ? this.state.currentIndex + 1 : 0
    this.setState({
      currentIndex: nextIndex,
      success: nextIndex === 0,
      items: nextIndex === 0 ? [] : this.state.items
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
            ? <div>
              {this.state.success &&
                <Alert bsStyle='success'><strong>Success!</strong> You have successfully imported your products.</Alert>
              }
              <ProductParser
                onParse={this._handleParse}
                suppliers={this.props.suppliers} />
            </div>
            : <ProductAdder
              onAdd={this._handleProductAdd}
              onUpdate={this._handleProductUpdate}
              onSkip={this._next}
              product={this.state.items[this.state.currentIndex]}
              products={this.props.products.items}
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
  fetchCatalog: React.PropTypes.func.isRequired,
  fetchSuppliers: React.PropTypes.func.isRequired,
  addProduct: React.PropTypes.func.isRequired,
  updateProduct: React.PropTypes.func.isRequired,
  venueId: React.PropTypes.string,
  products : React.PropTypes.object,
  suppliers: React.PropTypes.object
}
export default ImportView
