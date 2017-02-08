import React, { Component } from 'react'
import { Media, Button, Label } from 'react-bootstrap'

class ListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      order: this.props.item.order || 0
    }
    this._handleAdd = this._handleAdd.bind(this)
    this._handleAmmountChange = this._handleAmmountChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.item.order !== this.props.item.order) {
      this.setState({
        order: nextProps.item.order || 0
      })
    }
  }

  _handleAmmountChange (e) {
    const order = e.currentTarget.value
    this.setState({
      order
    })
  }

  _handleAdd () {
    this.props.onSelect({
      ...this.props.item,
      order: this.state.order
    })
  }

  render () {
    const { item } = this.props
    const { images, name, category, capacity, sub_category: subCategory } = item.product_id

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
            <Label>{category}</Label>{' '}
            {subCategory &&
              <span>
                <Label>{subCategory}</Label>{' '}
              </span>
            }
            <Label>{capacity} ml</Label>{' '}
            <Label>
              £{item.cost_price} x {this.state.order}
              {' '}(£{Math.round(item.cost_price * this.state.order * 100) / 100})
            </Label>
          </p>
        </Media.Body>
        <Media.Right align='middle'>
          <input
            type='number'
            className='form-control'
            onChange={this._handleAmmountChange}
            value={this.state.order}
            disabled={item.added} />
          {!item.added &&
            <Button onClick={this._handleAdd}>Add</Button>
          }
          {item.added &&
            <Button disabled>Added</Button>
          }
        </Media.Right>
      </Media>
    )
  }
}

ListItem.propTypes = {
  item: React.PropTypes.shape({
    product_id: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      category: React.PropTypes.string.isRequired,
      sub_category: React.PropTypes.string,
      capacity: React.PropTypes.number.isRequired,
      images: React.PropTypes.object
    }),
    order: React.PropTypes.number
  }),
  onSelect: React.PropTypes.func.isRequired
}

export default ListItem
