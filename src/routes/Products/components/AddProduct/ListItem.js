import React, { Component } from 'react'
import { Media, Button, Label } from 'react-bootstrap'

class ListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submitting: false
    }
    this._handleAdd = this._handleAdd.bind(this)
  }

  _handleAdd (item) {
    this.setState({
      submitting: true
    })
    this.props.onSelect(item)
  }

  render () {
    const { item, added } = this.props
    const { images, name, category, capacity, sub_category: subCategory, measure_unit: measureUnit } = item

    return (
      <Media>
        <Media.Left align='middle'>
          <div>
            <img src={images && images.thumbnail} alt={name} />
          </div>
        </Media.Left>
        <Media.Body>
          <Media.Heading>{name}</Media.Heading>
          <p>
            <Label>{category}</Label>
            {subCategory && subCategory !== 'other' &&
              <span>
                <Label>{subCategory}</Label>
              </span>
            }
            <Label>{capacity} {measureUnit}</Label>
          </p>
        </Media.Body>
        <Media.Right align='middle'>
          {!added &&
            <Button onClick={() => this._handleAdd(item)} disabled={this.state.submitting}>Add</Button>
          }
        </Media.Right>
      </Media>
    )
  }
}

ListItem.propTypes = {
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

export default ListItem
