import React from 'react'
import { Media, Button, Label } from 'react-bootstrap'

const ListItem = ({ item : { images, name, type, category, capacity, sub_category: subCategory }, item, onSelect }) => (
  <Media>
    <Media.Left align='middle'>
      <img width={50} height={50} src={images && images.thumbnail} alt={name} />
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
      <Button onClick={() => onSelect(item)}>Add</Button>
    </Media.Right>
  </Media>
)

ListItem.propTypes = {
  item: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired,
    category: React.PropTypes.string.isRequired,
    sub_category: React.PropTypes.string,
    capacity: React.PropTypes.number.isRequired,
    images: React.PropTypes.object.isRequired
  }),
  onSelect: React.PropTypes.func.isRequired
}

export default ListItem
