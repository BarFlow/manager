import React, { Component } from 'react'
import { Media, Button, Label } from 'react-bootstrap'

class CatalogListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submitting: false
    }
    this._handleSelect = this._handleSelect.bind(this)
  }

  _handleSelect (item) {
    this.setState({
      submitting: true
    })
    this.props.onSelect(item)
  }

  render () {
    const { item, added } = this.props
    const { images, name, type, category, capacity, sub_category: subCategory } = item

    return (
      <Media className='catalog-item'>
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
          {!added &&
            <Button onClick={() => this._handleSelect(item)} disabled={this.state.submitting}>Select</Button>
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
  added: React.PropTypes.bool.isRequired,
  onSelect: React.PropTypes.func.isRequired
}

export default CatalogListItem
