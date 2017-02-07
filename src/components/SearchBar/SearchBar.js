import React, { Component } from 'react'
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import _ from 'lodash'
import './SearchBar.scss'

class SearchBar extends Component {
  constructor (props) {
    super(props)

    this._handleChange = this._handleChange.bind(this)
  }

  _handleChange (event) {
    const { id, value } = event.target
    const { filters = {}, onChange } = this.props
    if (id === 'category') {
      const category = value.split(' - ')
      filters.category = category.shift()
      filters.sub_category = category.join(' - ')
    }

    if (id === 'supplier') {
      filters.supplier = value
    }
    onChange(filters)
  }

  render () {
    const { types, filters = {}, suppliers, exclude = [] } = this.props
    const typeTree = types.tree
    const dropdownSize = 6 / (2 - exclude.length)

    const supplierSelector =
      <FormGroup controlId='supplier' className={`col-xs-${dropdownSize}`}>
        <ControlLabel>Supplier</ControlLabel>
        {' '}
        <FormControl
          componentClass='select'
          onChange={this._handleChange}
          value={filters['supplier'] || ''}>
          <option value=''>any</option>
          {suppliers &&
            suppliers.items.map(supplier =>
              <option
                key={supplier._id}
                value={supplier._id}>
                {supplier.name}
              </option>
          )}
        </FormControl>
      </FormGroup>

    const categoryOptions = []

    _.orderBy(Object.keys(typeTree.beverage.children)).map(category => {
      categoryOptions.push(<option
        key={typeTree.beverage.children[category]._id}
        value={typeTree.beverage.children[category].title}>
        {typeTree.beverage.children[category].title}
      </option>)

      _.orderBy(Object.keys(typeTree.beverage.children[category].children)).map(subCategory =>
        categoryOptions.push(<option
          key={typeTree.beverage.children[category].children[subCategory]._id}
          value={`${typeTree.beverage.children[category].title} - ${typeTree.beverage.children[category].children[subCategory].title}`}>
          {typeTree.beverage.children[category].title} {' - '}
          {typeTree.beverage.children[category].children[subCategory].title}
        </option>)
      )
    })

    const categorySelector =
      <FormGroup controlId='category' className={`col-xs-${dropdownSize}`}>
        <ControlLabel>Category</ControlLabel>
        {' '}
        <FormControl
          componentClass='select'
          onChange={this._handleChange}
          value={filters['sub_category'] ? `${filters['category']} - ${filters['sub_category']}` : filters['category']}>
          <option value=''>any</option>
          {typeTree.beverage &&
            categoryOptions
          }
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
            value={filters['name'] || ''}
            placeholder='Product Name'
            onChange={this._handleChange} />
        </FormGroup>
        {exclude.indexOf('suppliers') === -1 && supplierSelector}
        {exclude.indexOf('category') === -1 && categorySelector}
      </Form>
    )
  }
}

SearchBar.propTypes = {
  onChange : React.PropTypes.func.isRequired,
  filters : React.PropTypes.object,
  types: React.PropTypes.object,
  suppliers: React.PropTypes.object,
  exclude: React.PropTypes.array
}
export default SearchBar
