import React, { Component } from 'react'
import { Media, Button, Label } from 'react-bootstrap'

class ListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ammount: this.props.item.ammount || 1
    }
    this._handleAdd = this._handleAdd.bind(this)
    this._handleAmmountChange = this._handleAmmountChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      ammount: nextProps.item.ammount || 1
    })
  }

  _handleAmmountChange (e) {
    const ammount = parseInt(e.currentTarget.value, 10)
    this.setState({
      ammount: ammount < 1 ? 1 : ammount
    })
  }

  _handleAdd () {
    this.props.onSelect({
      ...this.props.item,
      ammount: this.state.ammount
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
            {subCategory && subCategory !== 'other' &&
              <span>
                <Label>{subCategory}</Label>{' '}
              </span>
            }
            <Label>{capacity} ml</Label>{' '}
            {item.cost_price !== undefined &&
              <span>
                <Label>£{item.cost_price}</Label>{' '}
              </span>
            }
            {item.order > 0 &&
              <span>
                <Label bsStyle='danger'>Par Level -{item.order}</Label>
              </span>
            }
          </p>
        </Media.Body>
        <Media.Right align='middle'>
          <input
            type='number'
            className='form-control'
            onChange={this._handleAmmountChange}
            value={this.state.ammount}
            disabled={item.added} />
          {!item.added &&
            <Button bsSize='small' onClick={this._handleAdd}>Add</Button>
          }
          {item.added &&
            <Button bsSize='small' disabled>Added</Button>
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
    ammount: React.PropTypes.number
  }),
  onSelect: React.PropTypes.func.isRequired
}

export default ListItem
