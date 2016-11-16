import React, { Component } from 'react'
import { Button, Alert } from 'react-bootstrap'
import './Products.scss'
import SubHeader from '../../../components/SubHeader'
import SearchBar from '../../../components/SearchBar'
import ProductListItem from './ProductListItem'

class Products extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.fetchProducts = this.props.fetchProducts.bind(this)
    this.updateProduct = this.props.updateProduct.bind(this)

    // Fetch products if there is new venueId
    if (this.props.venueId && (this.props.products && this.props.products.filters.venue_id !== this.props.venueId)) {
      this.fetchProducts({ venue_id: this.props.venueId })
    }
  }

  componentWillReceiveProps (nextProps) {
    // Only fetch new products for new venue
    if (this.props.venueId !== nextProps.venueId) {
      this.fetchProducts({ venue_id: nextProps.venueId })
    }
  }

  render () {
    const { products, venueId } = this.props

    const ProductList = products.items.map(item => {
      return <ProductListItem key={item._id} item={item} updateProduct={this.updateProduct} />
    })

    return (
      <div className='row'>

        <SubHeader
          left={<h3>Products</h3>}
          right={<Button>Add new</Button>} />

        <div className='col-xs-12 col-sm-10 col-sm-offset-1 products'>

          <SearchBar
            filters={{ ...products.filters, venue_id: venueId }}
            handleSubmit={this.fetchProducts}
            submitting={products.isFetching} />

          <div className='items'>
            {!products.isFetching && venueId ? (
              ProductList.length ? (ProductList) : (<Alert bsStyle='warning'>No items found.</Alert>)
            ) : (
              <Alert bsStyle='warning'>Loading...</Alert>
            )}
          </div>

        </div>

      </div>
    )
  }
}

Products.propTypes = {
  fetchProducts: React.PropTypes.func.isRequired,
  updateProduct: React.PropTypes.func.isRequired,
  products: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string
}
export default Products
