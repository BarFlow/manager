import React, { Component } from 'react'
import { Media, Button, Label } from 'react-bootstrap'

class ListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submitted: false
    }
    this._handleAdd = this._handleAdd.bind(this)
  }

  _handleAdd (item) {
    this.setState({
      submitted: true
    })
    this.props.onSelect(item)
  }

  render () {
    const { item } = this.props
    const { name, email, address, tel } = item

    return (
      <Media>
        <Media.Body>
          <Media.Heading>{name}</Media.Heading>
          <p>
            <Label>{email}</Label>{' '}
            <Label>{address}</Label>{' '}
            <Label>{tel}</Label>
          </p>
        </Media.Body>
        <Media.Right align='middle'>
          {!this.state.submitted &&
            <Button onClick={() => this._handleAdd(item)}>Add</Button>
          }
        </Media.Right>
      </Media>
    )
  }
}

ListItem.propTypes = {
  item: React.PropTypes.shape({
    name: React.PropTypes.string.isRequired,
    email: React.PropTypes.string,
    address: React.PropTypes.string,
    tel: React.PropTypes.string
  }),
  onSelect: React.PropTypes.func.isRequired
}

export default ListItem
