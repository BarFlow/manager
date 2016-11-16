import React, { Component } from 'react'
import { Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap'
import './SearchBar.scss'

class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.initialFilters = {
      'product[name]': '',
      'product[type]': '',
      'product[category]': '',
      'product[sub_category]': ''
    }
    this.state = {
      filters: {
        ...this.initialFilters,
        ...this.props.filters
      }
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.props.handleSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      // Reset form is venue_id has changed
      filters: nextProps.filters.venue_id !== this.state.filters.venue_id ? {
        ...this.state.filters,
        ...nextProps.filters
      } : {
        ...this.initialFilters,
        ...nextProps.filters
      }
    })
  }

  handleChange (event) {
    const { id, value } = event.target
    const { filters } = this.state
    this.setState({
      filters: {
        ...filters,
        ...{
          'product[category]': id === 'type' ? '' : filters['product[category]'],
          'product[sub_category]': id === ('type' || 'category') ? '' : filters['product[sub_category]']
        },
        [`product[${id}]`]: value
      }
    })
  }

  findTypeIdByTitle (title) {
    return this.props.types.items.find(item => item.title === title) &&
      this.props.types.items.find(item => item.title === title)._id
  }

  buildTypeTree (types) {
    return types.reduce((mem, type) => {
      type.children = types.reduce((mem, item) => {
        if (item.parent_id === type._id) {
          mem[item.title] = item
        }
        return mem
      }, {})
      if (!type.parent_id) {
        mem[type.title] = type
      }
      return mem
    }, {})
  }

  render () {
    const { types } = this.props
    const { filters } = this.state

    const typeSelector =
      <FormGroup controlId='type' className='col-xs-2'>
        <ControlLabel>Type</ControlLabel>
        {' '}
        <FormControl
          componentClass='select'
          onChange={this.handleChange}
          value={filters['product[type]']}
          disabled={!types.items.length}>
          <option value=''>any</option>
          {types.items.filter(type => !type.parent_id).map(type =>
            <option key={type._id} value={type.title}>{type.title}</option>
          )}
        </FormControl>
      </FormGroup>

    const categorySelector =
      <FormGroup controlId='category' className='col-xs-2'>
        <ControlLabel>Category</ControlLabel>
        {' '}
        <FormControl
          componentClass='select'
          onChange={this.handleChange}
          value={filters['product[category]']}
          disabled={filters['product[type]'] === ''}>
          <option value=''>any</option>
          {types.items.filter(item =>
            item.parent_id === this.findTypeIdByTitle(filters['product[type]'])).map(type =>
              <option key={type._id} value={type.title}>{type.title}</option>
          )}
        </FormControl>
      </FormGroup>

    const subCategorySelector =
      <FormGroup controlId='sub_category' className='col-xs-2'>
        <ControlLabel>Subcategory</ControlLabel>
        {' '}
        <FormControl
          componentClass='select'
          onChange={this.handleChange}
          value={filters['product[sub_category]']}
          disabled={filters['product[category]'] === ''}>
          <option value=''>any</option>
          {types.items.filter(item =>
            item.parent_id === this.findTypeIdByTitle(filters['product[category]'])).map(type =>
              <option key={type._id} value={type.title}>{type.title}</option>
          )}
        </FormControl>
      </FormGroup>

    return (
      <Form className='search-bar row' onSubmit={(e) => { e.preventDefault(); this.handleSubmit(filters) }} >
        {typeSelector}
        {categorySelector}
        {subCategorySelector}
        <FormGroup controlId='name' className='name col-xs-6'>
          <ControlLabel>Name</ControlLabel>
          <div>
            <FormControl
              type='text'
              value={filters['product[name]']}
              placeholder='Product Name'
              onChange={this.handleChange} />
            <Button type='submit' disabled={this.props.submitting}>
            Search
            </Button>
          </div>
        </FormGroup>
      </Form>
    )
  }
}

SearchBar.propTypes = {
  handleSubmit : React.PropTypes.func.isRequired,
  filters : React.PropTypes.object,
  submitting: React.PropTypes.bool,
  types: React.PropTypes.object
}
export default SearchBar
