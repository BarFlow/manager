import React, { Component } from 'react'
import { Form, FormGroup, ControlLabel, FormControl, Button, InputGroup } from 'react-bootstrap'

class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.props.onSubmit.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
  }

  handleChange (event) {
    this.setState({
      name : event.target.value
    })
  }

  _onSubmit (e) {
    e.preventDefault()
    this.onSubmit(this.state)
    this.setState({ name:'' })
  }

  render () {
    return (
      <Form onSubmit={this._onSubmit} >
        <FormGroup controlId='name'>
          <ControlLabel>Create new</ControlLabel>
          {' '}
          <InputGroup>
            <FormControl
              autoComplete='off'
              type='text'
              value={this.state.name}
              placeholder='Venue Name'
              onChange={this.handleChange} />
            <InputGroup.Button>
              <Button type='submit' disabled={this.props.submitting}>
              Create
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </Form>
    )
  }
}

SearchBar.propTypes = {
  onSubmit : React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired
}
export default SearchBar
