import React, { Component } from 'react'
import { Button, Panel, ProgressBar, Alert } from 'react-bootstrap'
import ProductItemForm from './ProductItemForm'

class ProductAdder extends Component {
  constructor (props) {
    super(props)

    this._onSubmit = this._onSubmit.bind(this)
  }

  _onSubmit (values) {
    console.log(values)
    this.props.onSubmit()
  }

  render () {
    const { product, onSubmit, percent = 0 } = this.props
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
                  <Button className='pull-right' onClick={() => this.refs.submitForm.submit()}>Add</Button>
                </div>
                <ProductItemForm
                  ref='submitForm'
                  initialValues={{
                    count_as_full: 0.5,
                    ...product,
                    supplier_id: supplier._id
                  }}
                  onSubmit={onSubmit}
                  form='importer'
                  enableReinitialize
                  suppliers={this.props.suppliers} />
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
  percent: React.PropTypes.number
}

export default ProductAdder
