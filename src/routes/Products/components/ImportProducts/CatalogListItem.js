import React, { Component } from 'react'
import { Media, Button, Label } from 'react-bootstrap'

class CatalogListItem extends Component {

  constructor (props) {
    super(props)

    this.state = {
      height: 0,
      width: 0
    }
  }

  render () {
    const { item, onSelect, isAdded, user } = this.props
    const { images, name, type, category, capacity, sub_category: subCategory } = item

    return (
      <Media className='catalog-item'>
        <Media.Left align='middle'>
          <div className={user.admin && 'admin'}>
            <img src={images && images.thumbnail} alt={name} onLoad={(e) => {
              if (user.admin) {
                this.setState({
                  width: e.target.naturalWidth,
                  height: e.target.naturalHeight
                })
              }
            }
            } />
            {user.admin &&
              <p>
                Height: {this.state.height} {' '}
                Width: {this.state.width}
              </p>
            }
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
          {(isAdded
            ? <Button disabled>Added</Button>
            : <Button onClick={() => onSelect(item)}>Add</Button>
          )}
          {user.admin &&
            <Button bsStyle='danger' onClick={() => this.props.deleteCatalogItem(item)}>Delete</Button>
          }
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
  selected: React.PropTypes.bool.isRequired,
  onSelect: React.PropTypes.func.isRequired,
  deleteCatalogItem: React.PropTypes.func.isRequired,
  user: React.PropTypes.object.isRequired
}

export default CatalogListItem
