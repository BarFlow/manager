import React, { Component } from 'react'
import { Form, FormGroup, ControlLabel, FormControl, Button, InputGroup } from 'react-bootstrap'
import './SearchBar.scss'

class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filters: this.props.filters
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.props.handleSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ filters: nextProps.filters })
  }

  handleChange (event) {
    this.setState({
      filters : {
        ...this.state.filters,
        [`product[${event.target.id}]`]: event.target.value
      }
    })
  }

  render () {
    return (
      <Form onSubmit={(e) => { e.preventDefault(); this.handleSubmit(this.state.filters) }} >
        <FormGroup controlId='name'>
          <ControlLabel>Search</ControlLabel>
          {' '}
          <InputGroup>
            <FormControl
              type='text'
              value={this.state.filters['product[name]'] || ''}
              placeholder='Product Name'
              onChange={this.handleChange} />
            <InputGroup.Button>
              <Button type='submit'>
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
  handleSubmit : React.PropTypes.func.isRequired,
  filters : React.PropTypes.object
}
export default SearchBar
