import React, { Component } from 'react'

import CreateProductForm from './CreateProductForm'

class CreateProduct extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentStep: 0,
      product: {
        type: 'beverage'
      }
    }

    this._addProductData = this._addProductData.bind(this)
    this._handleBack = this._handleBack.bind(this)
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
        data
      },
      currentStep: this.state.currentStep + 1
    })
  }

  _handleBack () {
    this.setState({
      currentStep: this.state.currentStep - 1
    })
  }

  render () {
    const { currentStep, product } = this.state
    const { types } = this.props
    return (
      <div>
        {currentStep === 0 &&
          <CreateProductForm
            onSubmit={this._addProductData}
            initialValues={product}
            types={types} />
        }
        {currentStep === 1 &&
          <div>Image select step</div>
        }
      </div>
    )
  }
}

CreateProduct.propTypes = {
  venueId: React.PropTypes.string.isRequired,
  types: React.PropTypes.object,
  fetchTypes: React.PropTypes.func.isRequired,
  createProduct: React.PropTypes.func.isRequired
}

export default CreateProduct
