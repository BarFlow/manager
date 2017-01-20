import React, { Component } from 'react'
import { Modal, ControlLabel, FormControl, Button } from 'react-bootstrap'

class AreaOrSectionAdder extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: ''
    }

    this.add = this.add.bind(this)
  }

  add (e) {
    e.preventDefault()
    const { currentType, venueId, venue, params, close } = this.props

    if (!this.state.name.length) {
      return
    }

    this.props.addVenueItem({
      type: currentType,
      payload: {
        venue_id: venueId,
        area_id: params.area_id,
        section_id: params.section_id,
        order: venue.items.length,
        name: this.state.name
      }
    })

    close()
  }

  render () {
    return (
      <form onSubmit={this.add}>
        <Modal.Body>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            autoFocus
            autoComplete='off'
            type='text'
            value={this.state.name}
            placeholder='Name'
            onChange={(e) => { this.setState({ name: e.currentTarget.value }) }} />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this._close}>Cancel</Button>
          <Button bsStyle='primary' type='submit'>Add</Button>
        </Modal.Footer>
      </form>
    )
  }
}

AreaOrSectionAdder.propTypes = {
  addVenueItem: React.PropTypes.func.isRequired,
  close: React.PropTypes.func.isRequired,
  currentType: React.PropTypes.string.isRequired,
  venueId: React.PropTypes.string.isRequired,
  params: React.PropTypes.object.isRequired,
  venue: React.PropTypes.object
}

export default AreaOrSectionAdder
