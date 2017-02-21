import React, { Component } from 'react'
import { Panel, ProgressBar, Alert } from 'react-bootstrap'

import ProductItemForm from './ProductItemForm'
import CatalogListItem from './CatalogListItem'

import CreateProductDialog from '../CreateProduct/Dialog'

class ProductAdder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isCreateDialogOpen: false
    }
    this._onSubmit = this._onSubmit.bind(this)
    this._onSkip = this._onSkip.bind(this)
    this._onSelect = this._onSelect.bind(this)
    this._toggleCreateProductDialog = this._toggleCreateProductDialog.bind(this)
  }

  componentDidMount () {
    this.props.fetchCatalog({
      name: this.props.product.name,
      limit: 30
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.product && this.props.product !== nextProps.product) {
      this.props.fetchCatalog({
        name: nextProps.product.name,
        limit: 30
      })
    }
  }

  _onSubmit (values) {
    const method = values._id ? 'onUpdate' : 'onAdd'
    return this.props[method]({
      ...values,
      product_id: this.product_id || values.product_id._id,
      count_as_full: values.count_as_full / 100
    }).then(() => {
      this.product_id = undefined
    })
  }

  _onSkip () {
    this.props.onSkip()
  }

  _onSelect (item) {
    this.product_id = item._id
    this.refs.ProductItemForm.submit()
  }

  _toggleCreateProductDialog () {
    window.scrollTo(0, 0)
    this.refs.createBtn.blur()
    this.setState({
      isCreateDialogOpen: !this.state.isCreateDialogOpen
    })
  }

  render () {
    const { product, products, percent = 0, catalog } = this.props
    const addedProduct = products.find(productsItem =>
      productsItem.supplier_product_code === product.supplier_product_code) || {}

    return (
      <div className='product-adder row'>
        <div className='col-xs-12'>
          <Panel>
            <label className='control-label'>Progress</label>
            <ProgressBar now={percent} label={`${percent}%`} />
          </Panel>
          <Panel>

            <ProductItemForm
              ref='ProductItemForm'
              initialValues={{
                count_as_full: 50,
                ...{
                  ...addedProduct,
                  count_as_full: addedProduct.count_as_full * 100
                },
                ...product
              }}
              onSubmit={this._onSubmit}
              onSkip={this._onSkip}
              form='importer'
              enableReinitialize
              suppliers={this.props.suppliers}
              product={product}
              usedSKU={addedProduct.supplier_product_code} />

            <label>Choose product</label>
            {catalog.isFetching &&
              <Alert bsStyle='warning'>Loading products from catalog.</Alert>
            }
            {catalog.items.map(item =>
              <CatalogListItem
                key={item._id}
                item={item}
                onSelect={this._onSelect}
                isAdded={!!products.find(productsItem => productsItem.product_id._id === item._id)}
                isDisabled={!!addedProduct.supplier_product_code} />
            )}
            {!catalog.isFetching &&
            <div>
              <Alert bsStyle='info'>
                <strong>Heads up!</strong>
                {' If you don\'t see your product in the list above, you can always just create it manually.'}
              </Alert>
              <CreateProductDialog
                isOpen={this.state.isCreateDialogOpen}
                close={this._toggleCreateProductDialog}
                initialValues={{ name: product.name }} />
              <div className='text-center'>
                <button className='btn btn-default' ref='createBtn' onClick={this._toggleCreateProductDialog}>
                  Create Product
                </button>
              </div>
            </div>
            }
          </Panel>
        </div>
      </div>
    )
  }
}

ProductAdder.propTypes = {
  onAdd: React.PropTypes.func.isRequired,
  onUpdate: React.PropTypes.func.isRequired,
  onSkip: React.PropTypes.func.isRequired,
  product: React.PropTypes.object.isRequired,
  products: React.PropTypes.array.isRequired,
  suppliers: React.PropTypes.object.isRequired,
  fetchCatalog: React.PropTypes.func.isRequired,
  catalog: React.PropTypes.object.isRequired,
  percent: React.PropTypes.number
}

export default ProductAdder
