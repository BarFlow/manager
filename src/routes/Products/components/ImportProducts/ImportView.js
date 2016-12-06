import React, { Component } from 'react'
// import { Button, Alert, Panel } from 'react-bootstrap'

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
    if (values) {
      // this.props.addProduct(values)
    }
    this.setState({
      currentIndex: this.state.currentIndex + 1
    })
  }

  render () {
    return (
      <div className='row'>
        <SubHeader
          className='bg-yellow'
          left={<h3>Products <span className='small'>/ Import</span></h3>}
          right={
            <div>
              {!!this.state.items.length &&
                <div>{this.state.currentIndex + 1} / {this.state.items.length} items</div>
              }
            </div>
          } />
        <div className='col-xs-12 col-sm-10 col-sm-offset-1 products'>
          {!this.state.items.length
            ? <ProductParser onParse={this._handleParse} />
            : <ProductAdder
              onSubmit={this._handleProductAdd}
              product={this.state.items[this.state.currentIndex]}
              suppliers={this.props.suppliers} />
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
