import React, { Component } from 'react'
import { Media, Label, Panel, Button, Collapse } from 'react-bootstrap'
import ProductListItemForm from './ProductListItemForm'

class ProductListItem extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      isFormOpen: false
    }
  }
  render () {
    const { name, type, category, subCategory, capacity, images } = this.props.item.product_id
    return (
      <Panel>
        <Media>
          <Media.Left>
            <img width={70} height={70} src={images && images.thumbnail} alt={name} />
          </Media.Left>
          <Media.Body>
            <Media.Heading>{name}</Media.Heading>
            <p>
              <Label>{type}</Label>{' '}
              <Label>{category}</Label>{' '}
              {subCategory &&
                <span>
                  <Label>{subCategory}</Label>{' '}
                </span>
              }
              <Label>{capacity} ml</Label>
            </p>
            <Collapse in={this.state.isFormOpen}>
              <div>
                <ProductListItemForm
                  form={this.props.item._id}
                  initialValues={this.props.item}
                  onSubmit={this.props.updateProduct} />
              </div>
            </Collapse>
          </Media.Body>
          <Media.Right>
            <Button onClick={() => { this.setState({ isFormOpen: !this.state.isFormOpen }) }}>
              Edit
            </Button>
          </Media.Right>
        </Media>
      </Panel>
    )
  }
}

ProductListItem.propTypes = {
  item: React.PropTypes.shape({
    _id: React.PropTypes.string.isRequired,
    product_id: React.PropTypes.shape({
      _id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      category: React.PropTypes.string.isRequired,
      subCategory: React.PropTypes.string,
      capacity: React.PropTypes.number.isRequired,
      images: React.PropTypes.object.isRequired
    })
  }),
  updateProduct: React.PropTypes.func.isRequired
}
export default ProductListItem
