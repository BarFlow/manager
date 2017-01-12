import React, { Component } from 'react'
import { Panel, ProgressBar, Alert, Button } from 'react-bootstrap'
import { SubmissionError } from 'redux-form'

import ProductItemForm from './ProductItemForm'
import CatalogListItem from './CatalogListItem'

import CreateProductDialog from '../CreateProduct/Dialog'

class ProductAdder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      product_id: '',
      isCreateDialogOpen: false
    }
    this._onSubmit = this._onSubmit.bind(this)
    this._onSkip = this._onSkip.bind(this)
    this._toggleCreateProductDialog = this._toggleCreateProductDialog.bind(this)
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
    return this.props.onSubmit({
      product_id: this.state.product_id,
      ...values
    }).then(() => {
      this.setState({
        product_id: ''
      })
    })
  }

  _onSkip () {
    this.props.onSubmit()
  }

  _toggleCreateProductDialog () {
    this.setState({
      isCreateDialogOpen: !this.state.isCreateDialogOpen
    })
  }

  render () {
    const { product, products, percent = 0, catalog } = this.props
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

                <ProductItemForm
                  initialValues={{
                    count_as_full: 0.5,
                    ...product,
                    supplier_id: supplier._id
                  }}
                  onSubmit={this._onSubmit}
                  onSkip={this._onSkip}
                  form='importer'
                  enableReinitialize
                  suppliers={this.props.suppliers}
                  product={product}
                  usedSKU={products
                    .map(productsItem => productsItem.supplier_product_code)
                    .find(productsItem => productsItem === product.supplier_product_code)} />

                <label>Choose product</label>
                {catalog.isFetching &&
                  <Alert bsStyle='warning'>Loading products from catalog.</Alert>
                }
                {catalog.items.map(item =>
                  <CatalogListItem
                    key={item._id}
                    item={item}
                    onSelect={(item) => this.setState({ product_id: item._id })}
                    isAdded={!!products.find(productsItem => productsItem.product_id._id === item._id)}
                    selected={this.state.product_id === item._id} />
                )}
                <Alert bsStyle='info'>
                  <strong>Heads up!</strong>
                  {' If you don\'t see your product in the list above, you can always just create it manually.'}
                </Alert>
                <CreateProductDialog
                  isOpen={this.state.isCreateDialogOpen}
                  close={this._toggleCreateProductDialog} />
                <div className='text-center'>
                  <Button onClick={this._toggleCreateProductDialog}>Create Product</Button>
                </div>
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
  products: React.PropTypes.array.isRequired,
  suppliers: React.PropTypes.object.isRequired,
  fetchCatalog: React.PropTypes.func.isRequired,
  catalog: React.PropTypes.object.isRequired,
  percent: React.PropTypes.number
}

export default ProductAdder
