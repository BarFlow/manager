import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Button, Alert, Checkbox, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'
import FormInput from '../../../../components/FormInput'
import FormSelect from '../../../../components/FormSelect'

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
      options={types.items.filter(item => item.parent_id === types.tree.beverage._id)}
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
        ? types.items.filter(item => item.parent_id === types.tree.beverage.children[category]._id)
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
      addon='ml'
      description='The volume of the product (ml).'
      className={'col-xs-12'} />

    <Field
      name='measurable'
      component={MeasuraleCheckbox} />

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

const MeasuraleCheckbox = ({ meta, input }) =>
  <FormGroup className={'col-xs-12'}
    validationState={(meta.touched && meta.error) ? ('error') : undefined}>
    <ControlLabel>Measurable product</ControlLabel>
    <Checkbox checked={input.value} {...input}>
      Measurable
    </Checkbox>
    <HelpBlock>
      {meta.touched && meta.error ? (
        <div>{meta.error}</div>
        ) : (
          <div>Select this if you wish to measure open bottles during stock take.</div>
        )
      }
    </HelpBlock>
  </FormGroup>

MeasuraleCheckbox.propTypes = {
  input: React.PropTypes.object,
  meta: React.PropTypes.object
}

export { MeasuraleCheckbox }
