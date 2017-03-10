import React, { Component } from 'react'
import { Media, Button, Label } from 'react-bootstrap'

class CatalogListItem extends Component {

  render () {
    const { item, onSelect, isAdded, isDisabled } = this.props
    const { images, name, type, category, capacity, sub_category: subCategory, measure_unit: measureUnit } = item

    return (
      <Media className='catalog-item'>
        <Media.Left align='middle'>
          <div>
            <img src={images && images.thumbnail} alt={name} />
          </div>
        </Media.Left>
        <Media.Body>
          <Media.Heading>{name}</Media.Heading>
          <p>
            <Label>{type}</Label>
            <Label>{category}</Label>
            {subCategory &&
              <span>
                <Label>{subCategory}</Label>
              </span>
            }
            <Label>{capacity} {measureUnit}</Label>
          </p>
        </Media.Body>
        <Media.Right align='middle'>
          {(isAdded
            ? <Button disabled>Added</Button>
            : <Button onClick={() => onSelect(item)} disabled={isDisabled}>Add</Button>
          )}
        </Media.Right>
      </Media>
    )
  }
}

CatalogListItem.propTypes = {
  item: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    category: React.PropTypes.string.isRequired,
    sub_category: React.PropTypes.string,
    capacity: React.PropTypes.number.isRequired,
    images: React.PropTypes.object.isRequired
  }),
  isAdded: React.PropTypes.bool.isRequired,
  isDisabled: React.PropTypes.bool.isRequired,
  onSelect: React.PropTypes.func.isRequired
}

export default CatalogListItem
