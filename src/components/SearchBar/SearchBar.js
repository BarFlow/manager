import React, { Component } from 'react'
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import './SearchBar.scss'

class SearchBar extends Component {
  constructor (props) {
    super(props)

    this._handleChange = this._handleChange.bind(this)
    this.onChange = this.props.onChange.bind(this)
  }

  _handleChange (event) {
    const { id, value } = event.target
    const { filters } = this.props
    this.onChange({
      ...filters,
      ...{
        skip: 0,
        category: id === 'type' ? '' : filters.category,
        sub_category: id === 'type' || id === 'category' ? '' : filters.sub_category
      },
      [`${id}`]: value
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
    const { types, filters } = this.props

    const typeSelector =
      <FormGroup controlId='type' className='col-xs-2'>
        <ControlLabel>Type</ControlLabel>
        {' '}
        <FormControl
          componentClass='select'
          onChange={this._handleChange}
          value={filters['type'] || ''}
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
          onChange={this._handleChange}
          value={filters['category'] || ''}
          disabled={!filters['type'] || filters['type'] === ''}>
          <option value=''>any</option>
          {types.items.filter(item =>
            item.parent_id === this.findTypeIdByTitle(filters['type'])).map(type =>
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
          onChange={this._handleChange}
          value={filters['sub_category'] || ''}
          disabled={!filters['category'] || filters['category'] === ''}>
          <option value=''>any</option>
          {types.items.filter(item =>
            item.parent_id === this.findTypeIdByTitle(filters['category'])).map(type =>
              <option key={type._id} value={type.title}>{type.title}</option>
          )}
        </FormControl>
      </FormGroup>

    return (
      <Form className='search-bar row' onSubmit={(e) => { e.preventDefault() }} >
        <FormGroup controlId='name' className='name col-xs-6'>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            autoFocus
            autoComplete='off'
            type='text'
            value={filters['name']}
            placeholder='Product Name'
            onChange={this._handleChange} />
        </FormGroup>
        {typeSelector}
        {categorySelector}
        {subCategorySelector}
      </Form>
    )
  }
}

SearchBar.propTypes = {
  onChange : React.PropTypes.func.isRequired,
  filters : React.PropTypes.object,
  types: React.PropTypes.object
}
export default SearchBar
