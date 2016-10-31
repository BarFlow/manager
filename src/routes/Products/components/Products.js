import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import './Products.scss'
import SubHeader from '../../../components/SubHeader'
import ProductListItem from './ProductListItem'

class Products extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.fetchProducts = this.props.fetchProducts.bind(this)

    if (this.props.venueId) {
      this.fetchProducts({ venue_id: this.props.venueId })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.venueId !== nextProps.venueId) {
      this.fetchProducts({ venue_id: nextProps.venueId })
    }
  }

  render () {
    const { products } = this.props
    const ProductList = products.items.map(item => {
      item.subCategory = item.sub_category
      return <ProductListItem key={item._id} product={item.product_id} />
    })
    return (
      <div className='row'>
        <SubHeader
          left={<h3>Products</h3>}
          right={<Button>Add new</Button>} />
        <div className='col-xs-12 col-md-10 col-md-offset-1'>
          {!products.isFetching ? (
            ProductList
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    )
  }
}

Products.propTypes = {
  fetchProducts: React.PropTypes.func.isRequired,
  products: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string
}
export default Products
