import React, { Component } from 'react'
import { Media, Label, Panel, Button, Collapse } from 'react-bootstrap'
import ProductListItemForm from './ProductListItemForm'

class ProductListItem extends Component {
  constructor (props) {
    super(props)
    this.props = props
    this.state = {
      isFormOpen: false,
      isClosing: false
    }

    this.toggleCollapse = this.toggleCollapse.bind(this)
  }

  toggleCollapse () {
    if (this.state.isFormOpen) {
      this.state.isClosing = true
      setTimeout(() => this.setState({ isClosing: false }), 300)
    }
    this.setState({ isFormOpen: !this.state.isFormOpen })
  }

  render () {
    const { name, type, category, sub_category: subCategory, capacity, images } = this.props.item.product_id
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
          </Media.Body>
          <Media.Right>
            <Button onClick={this.toggleCollapse}>
              {!this.state.isFormOpen ? (
                'Edit'
              ) : (
                'Done'
              )}
            </Button>
          </Media.Right>
          <Collapse in={this.state.isFormOpen}>
            <div>
              <hr />
              {(this.state.isFormOpen || this.state.isClosing) &&
                <ProductListItemForm
                  form={this.props.item._id}
                  initialValues={{
                    ...this.props.item,
                    product_id: undefined
                  }}
                  onSubmit={this.props.updateProduct} />
              }
            </div>
          </Collapse>
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
      sub_category: React.PropTypes.string,
      capacity: React.PropTypes.number.isRequired,
      images: React.PropTypes.object
    })
  }),
  updateProduct: React.PropTypes.func.isRequired
}
export default ProductListItem
