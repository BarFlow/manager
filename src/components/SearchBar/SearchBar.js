import React, { Component } from 'react'
import { Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import _ from 'lodash'
import './SearchBar.scss'

class SearchBar extends Component {
  constructor (props) {
    super(props)

    this._handleChange = this._handleChange.bind(this)
  }

  componentDidMount () {
    const { types, fetchTypes, suppliers, fetchSuppliers, venueId } = this.props

    // Fetch suppliers if needed
    if (
      (!suppliers.items.length && !suppliers.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && suppliers.items.length && venueId !== suppliers.items[0].venue_id)
    ) {
      fetchSuppliers(venueId)
    }

    // Fetch products if needed
    if (
      (!types.items.length && !types.isFetching && venueId) ||
      // Dirty way to check if the current venue_id is valid, should be other way
      (venueId && types.items.length && venueId !== types.items[0].venue_id)
    ) {
      fetchTypes(venueId)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { fetchTypes, fetchSuppliers, venueId } = this.props
    if (nextProps.venueId !== venueId) {
      fetchTypes(nextProps.venueId)
      fetchSuppliers(nextProps.venueId)
    }
  }

  _handleChange (event) {
    const { id, value } = event.target
    const { filters = {}, onChange } = this.props
    const change = {}
    if (id === 'category') {
      const category = value.split(' - ')
      change.category = category.shift()
      change.sub_category = category.join(' - ')
    } else {
      change[id] = value
    }

    onChange({ ...filters, skip: 0, ...change })
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

    typeTree.beverage && _.orderBy(Object.keys(typeTree.beverage.children)).map(category => {
      categoryOptions.push(<option
        key={typeTree.beverage.children[category]._id}
        value={typeTree.beverage.children[category].title}>
        {typeTree.beverage.children[category].title}
      </option>)

      _.orderBy(Object.keys(typeTree.beverage.children[category].children)).map(subCategory =>
        categoryOptions.push(<option
          key={typeTree.beverage.children[category].children[subCategory]._id}
          // eslint-disable-next-line
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
  fetchTypes: React.PropTypes.func.isRequired,
  suppliers: React.PropTypes.object,
  fetchSuppliers: React.PropTypes.func.isRequired,
  exclude: React.PropTypes.array,
  venueId: React.PropTypes.string
}
export default SearchBar
