import React, { Component } from 'react'

import CreateProductForm from './CreateProductForm'
import ImageSelect from './ImageSelect'
import Measure from './Measure'
import Review from './Review'

import './CreateProduct.scss'

class CreateProduct extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentStep: 0,
      product: {
        type: 'beverage',
        measurable: false
      }
    }

    this._addProductData = this._addProductData.bind(this)
    this._handleBack = this._handleBack.bind(this)
    this._handleSubmit = this._handleSubmit.bind(this)
  }

  componentDidMount () {
    const { types, fetchTypes } = this.props
    if (!types.items.length) {
      fetchTypes()
    }
  }

  _addProductData (data) {
    this.setState({
      product: {
        ...this.state.product,
        ...data
      },
      currentStep: this.state.currentStep + 1
    })
  }

  _handleBack () {
    this.setState({
      currentStep: this.state.currentStep - 1
    })
  }

  _handleSubmit () {
    const product = this.state.product
    let method = ''
    if ((product._id && product.venue_id) || (product._id && this.props.user.admin)) {
      method = 'updateCatalogItem'
    } else {
      method = 'addCatalogItem'
    }
    return this.props[method]({
      venue_id: !this.props.user.admin ? this.props.venueId : undefined,
      parent_id: (method === 'addCatalogItem' && product._id) ? product._id : undefined,
      ...product
    }).then(item => this.props.onSubmit && this.props.onSubmit(item))
  }

  render () {
    const { currentStep, product } = this.state
    const { types, token, initialValues, close } = this.props
    return (
      <div>
        {currentStep === 0 &&
          <CreateProductForm
            onSubmit={this._addProductData}
            initialValues={{ ...product, ...initialValues }}
            types={types} />
        }
        {currentStep === 1 &&
          <ImageSelect
            next={this._addProductData}
            back={this._handleBack}
            token={token}
            product={product}
            types={types} />
        }
        {currentStep === 2 && product.measurable &&
          <Measure next={this._addProductData} back={this._handleBack} product={product} />
        }
        {((currentStep === 2 && !product.measurable) || currentStep === 3) &&
          <Review
            product={product}
            back={this._handleBack}
            submit={this._handleSubmit}
            close={close} />
        }
      </div>
    )
  }
}

CreateProduct.propTypes = {
  venueId: React.PropTypes.string.isRequired,
  types: React.PropTypes.object,
  initialValues: React.PropTypes.object,
  fetchTypes: React.PropTypes.func.isRequired,
  token: React.PropTypes.string.isRequired,
  user: React.PropTypes.object.isRequired,
  close: React.PropTypes.func,
  onSubmit: React.PropTypes.func
}

export default CreateProduct
