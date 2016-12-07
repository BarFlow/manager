import React, { Component } from 'react'
import { Button, Panel, ProgressBar, Alert } from 'react-bootstrap'
import { SubmissionError } from 'redux-form'

import ProductItemForm from './ProductItemForm'
import CatalogListItem from './CatalogListItem'

class ProductAdder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      product_id: ''
    }
    this._onSubmit = this._onSubmit.bind(this)
    this._skip = this._skip.bind(this)
  }

  componentDidMount () {
    this.props.fetchCatalog({
      name: this.props.product.name
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.product && this.props.product !== nextProps.product) {
      this.props.fetchCatalog({
        name: nextProps.product.name
      })
    }
  }

  _onSubmit (values) {
    if (!this.state.product_id) {
      return Promise.reject(new SubmissionError({ _error: 'Please select a product to continue.' }))
    }
    this.props.onSubmit({
      product_id: this.state.product_id,
      ...values
    })
    this.setState({
      product_id: ''
    })
  }

  _skip () {
    this.props.onSubmit()
  }

  render () {
    const { product, percent = 0, catalog } = this.props
    const supplier = this.props.suppliers.items.find(item =>
      product && product.supplier && item.name.toLowerCase() === product.supplier.toLowerCase()) || {}
    return (
      <div className='product-adder row'>
        <div className='col-xs-12'>
          <Panel>
            <ProgressBar now={percent} label={`${percent}%`} />
          </Panel>
          {product
            ? (
              <Panel>
                <div className='page-header clearfix'>
                  <h4>{product.name}</h4>
                  <Button
                    className='pull-right'
                    bsStyle='primary'
                    onClick={() => this.refs.submitForm.submit()}>Add</Button>
                  <Button
                    className='pull-right'
                    bsStyle='danger'
                    onClick={this._skip}>Skip</Button>
                </div>
                <ProductItemForm
                  ref='submitForm'
                  initialValues={{
                    count_as_full: 0.5,
                    ...product,
                    supplier_id: supplier._id
                  }}
                  onSubmit={this._onSubmit}
                  form='importer'
                  enableReinitialize
                  suppliers={this.props.suppliers} />
                <label>Choose product</label>
                {catalog.isFetching &&
                  <Alert bsStyle='warning'>Loading products from catalog.</Alert>
                }
                {catalog.items.map(item =>
                  <CatalogListItem
                    key={item._id}
                    item={item}
                    onSelect={(item) => this.setState({ product_id: item._id })}
                    added={false}
                    selected={this.state.product_id === item._id} />
                )}
              </Panel>
            ) : (
              <Alert bsStyle='success'><strong>Success!</strong> You have successfully imported your products.</Alert>
            )
          }
        </div>
      </div>
    )
  }
}

ProductAdder.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  product: React.PropTypes.object.isRequired,
  suppliers: React.PropTypes.object.isRequired,
  fetchCatalog: React.PropTypes.func.isRequired,
  catalog: React.PropTypes.object.isRequired,
  percent: React.PropTypes.number
}

export default ProductAdder
