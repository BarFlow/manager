import React from 'react'
import { Media, Button, Label } from 'react-bootstrap'

const CatalogListItem = ({ item, added, selected, onSelect }) => {
  const { images, name, type, category, capacity, sub_category: subCategory } = item

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
      <Media.Right align='middle'>
        {!added &&
          <Button
            onClick={() => onSelect(item)}
            bsStyle={selected ? 'success' : 'default'}>
            {selected ? 'Selected' : 'Select'}
          </Button>
        }
      </Media.Right>
    </Media>
  )
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
  added: React.PropTypes.bool.isRequired,
  selected: React.PropTypes.bool.isRequired,
  onSelect: React.PropTypes.func.isRequired
}

export default CatalogListItem
