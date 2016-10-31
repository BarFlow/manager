import React from 'react'
import { Media, Label, Panel } from 'react-bootstrap'

const ProductListItem = ({ product }) => {
  const { name, type, category, subCategory, capacity, images } = product
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
      </Media>
    </Panel>
  )
}

ProductListItem.propTypes = {
  product: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    category: React.PropTypes.string.isRequired,
    subCategory: React.PropTypes.string,
    capacity: React.PropTypes.number.isRequired,
    images: React.PropTypes.object.isRequired
  })
}
export default ProductListItem
