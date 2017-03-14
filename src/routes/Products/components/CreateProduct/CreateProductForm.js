import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import buildSchema from 'redux-form-schema'
import _ from 'lodash'

import { Button, Alert } from 'react-bootstrap'
import FormInput from '../../../../components/FormInput'
import FormSelect from '../../../../components/FormSelect'
import FormCheckbox from '../../../../components/FormCheckbox'

const other = {
  _id: 'other',
  title: 'other'
}

let CreateProductForm = ({
  error, submitSucceeded, handleSubmit, submitting, dirty, types, category
}) => (
  <form onSubmit={handleSubmit} className={'row'}>

    <Field
      name='name'
      component={FormInput}
      label='Name'
      type='text'
      description='The name of the product.'
      className={'col-xs-12'} />

    <Field
      name='category'
      component={FormSelect}
      label='Category'
      type='select'
      description='The category of the product.'
      options={[
        ..._.orderBy(types.items.filter(item => item.parent_id === types.tree.beverage._id), 'title'),
        other
      ]}
      className={'col-xs-12'}
      displayKey={'title'}
      valueKey={'title'} />

    <Field
      name='sub_category'
      component={FormSelect}
      label='Subcategory'
      type='select'
      description='The subcategory of the product.'
      options={category
        ? _.orderBy(types.items.filter(item =>
            types.tree.beverage.children[category] && item.parent_id === types.tree.beverage.children[category]._id),
            'title')
        : []
      }
      disabled={!category}
      className={'col-xs-12'}
      displayKey={'title'}
      valueKey={'title'} />

    <Field
      name='capacity'
      component={FormInput}
      label='Capacity'
      type='number'
      description='The volume of the product.'
      className={'col-xs-12'} />

    <Field
      name='measure_unit'
      component={FormSelect}
      label='Measure Unit'
      addon='ml'
      description='The measure unit of the product.'
      className={'col-xs-12'}
      options={[
        { name: 'ml' },
        { name: 'cl' },
        { name: 'l' },
        { name: 'g' },
        { name: 'dkg' },
        { name: 'kg' }
      ]}
      valueKey='name' />

    <Field
      name='measurable'
      component={FormCheckbox}
      label='Measurable product'
      option='Measurable'
      className={'col-xs-12'}
      description='Select this if you wish to measure open bottles during stock take.' />

    <div className={'col-xs-12'}>
      {error &&
        <Alert bsStyle='danger'>
          <strong>Woops!</strong> {error}
        </Alert>
      }
      <div className='product-create-footer'>
        <Button bsStyle='primary' type='submit'>
          Next
        </Button>
      </div>
    </div>
  </form>
)

const { validate } = buildSchema({
  name: {
    required: true,
    label: 'Name'
  },
  category: {
    required: true,
    label: 'Category'
  },
  capacity: {
    required: true,
    label: 'Capacity'
  },
  measure_unit: {
    required: true,
    label: 'Measure'
  }
})

CreateProductForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  category: React.PropTypes.string,
  submitSucceeded: React.PropTypes.bool,
  dirty: React.PropTypes.bool,
  types: React.PropTypes.object
}

CreateProductForm = reduxForm({
  validate,
  form: 'createProduct'
})(CreateProductForm)

const selector = formValueSelector('createProduct')

export default connect(state => ({
  category: selector(state, 'category')
}))(CreateProductForm)
