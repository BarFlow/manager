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
        sub_category: id === 'category' ? '' : filters.sub_category
      },
      [`${id}`]: value
    })
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
    const { types, filters, suppliers } = this.props
    const typeTree = this.buildTypeTree(types.items)

    const supplierSelector =
      <FormGroup controlId='supplier' className='col-xs-2'>
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

    const categorySelector =
      <FormGroup controlId='category' className='col-xs-2'>
        <ControlLabel>Category</ControlLabel>
        {' '}
        <FormControl
          componentClass='select'
          onChange={this._handleChange}
          value={filters['category'] || ''}>
          <option value=''>any</option>
          {typeTree.beverage &&
            Object.keys(typeTree.beverage.children).map(category =>
              <option
                key={typeTree.beverage.children[category]._id}
                value={typeTree.beverage.children[category].title}>
                {typeTree.beverage.children[category].title}
              </option>
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
          {filters['category'] &&
            Object.keys(typeTree.beverage.children[filters['category']].children).map(subCategory =>
              <option
                key={typeTree.beverage.children[filters['category']].children[subCategory]._id}
                value={typeTree.beverage.children[filters['category']].children[subCategory].title}>
                {typeTree.beverage.children[filters['category']].children[subCategory].title}
              </option>
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
            value={filters['name'] || ''}
            placeholder='Product Name'
            onChange={this._handleChange} />
        </FormGroup>
        {supplierSelector}
        {categorySelector}
        {subCategorySelector}
      </Form>
    )
  }
}

SearchBar.propTypes = {
  onChange : React.PropTypes.func.isRequired,
  filters : React.PropTypes.object,
  types: React.PropTypes.object,
  suppliers: React.PropTypes.object
}
export default SearchBar
