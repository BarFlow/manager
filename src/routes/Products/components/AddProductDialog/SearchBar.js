import React, { Component } from 'react'
import { Form, FormGroup, ControlLabel, FormControl, Button, InputGroup } from 'react-bootstrap'

class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filters: {}
    }
    this.handleChange = this.handleChange.bind(this)
    this.onSubmit = this.props.onSubmit.bind(this)
  }

  handleChange (event) {
    this.setState({
      filters : {
        ...this.state.filters,
        [event.target.id]: event.target.value
      }
    })
  }

  render () {
    return (
      <Form onSubmit={(e) => { e.preventDefault(); this.onSubmit(this.state.filters) }} >
        <FormGroup controlId='name'>
          <ControlLabel>Search</ControlLabel>
          {' '}
          <InputGroup>
            <FormControl
              type='text'
              value={this.state.filters['name'] || ''}
              placeholder='Product Name'
              onChange={this.handleChange} />
            <InputGroup.Button>
              <Button type='submit' disabled={this.props.submitting}>
              Search
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
