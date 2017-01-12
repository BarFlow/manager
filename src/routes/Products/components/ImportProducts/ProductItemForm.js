import React from 'react'
import { reduxForm, Field } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Alert, Button } from 'react-bootstrap'
import FormInput from '../../../../components/FormInput'
import FormSelect from '../../../../components/FormSelect'

const ProductItemForm = ({
  error, submitSucceeded, handleSubmit, onSkip, submitting, dirty, suppliers, product, usedSKU
}) => (
  <form onSubmit={handleSubmit} className={'row'}>
    <div className={'col-xs-12'}>
      <div className='page-header clearfix'>
        <h4>{product.name}</h4>
        {/* <Button
          className='pull-right'
          bsStyle='primary'
          disabled={submitting}
          type='submit'>Add</Button> */}
        <Button
          className='pull-right'
          bsStyle='danger'
          disabled={submitting}
          onClick={onSkip}>Skip</Button>
      </div>
      {error &&
        <Alert bsStyle='danger'>
          <strong>Woops!</strong> {error}
        </Alert>
      }
      {!error && usedSKU &&
        <Alert bsStyle='warning'>
          <strong>Duplicate!</strong>
          {` A product with the SKU:${usedSKU} has already been added, skip if you don't want to add it again.`}
        </Alert>
      }
      {/* submitSucceeded && !submitting && !dirty &&
      <Alert bsStyle='success'>
        <strong>Success!</strong> Your changes have been saved successfully.
      </Alert> */}
    </div>
    <Field
      name='supplier_id'
      component={FormSelect}
      label='Supplier'
      type='select'
      description='The supplier for the product.'
      options={suppliers.items}
      className={'col-xs-12 col-md-4'} />

    <Field
      name='supplier_product_code'
      component={FormInput}
      label='SKU'
      type='text'
      description='The product code associated with the supplier.'
      className={'col-xs-12 col-md-4'} />

    <Field
      name='par_level'
      component={FormInput}
      label='Par Level'
      type='number'
      description='The minimum quantity that your business must keep on hand.'
      className={'col-xs-12 col-md-4'} />

    {/*
      <Field
        name='cost_price'
        component={FormInput}
        label='Cost Price'
        type='number'
        addon='£'
        description='The price at which the product have been bought.'
        className={'col-xs-12 col-md-3'} />

      <Field
        name='sale_unit_size'
        component={FormInput}
        label='Serving Measure'
        type='number'
        addon='ml'
        description='The base serving measure for the product.'
        className={'col-xs-12 col-md-3'} />
    */}

    <Field
      name='sale_price'
      component={FormInput}
      label='Sale Price / Measure'
      type='number'
      addon='£'
      description='The price at which the product will be sold.'
      className={'col-xs-12 col-md-4'} />

    <Field
      name='package_size'
      component={FormInput}
      label='Case Size'
      type='number'
      description='The number of bottles in a full package.'
      className={'col-xs-12 col-md-4'} />

    <Field
      name='count_as_full'
      component={FormInput}
      label='Count as Full'
      type='number'
      description='The minimum level of liquid in the bottle to be counted as full during order sheet generation.'
      className={'col-xs-12 col-md-4'} />
  </form>
)

const { validate } = buildSchema({
  par_level: {
    error: 'This should be an integer.',
    type: 'int'
  },
  count_as_full: {
    error: 'This should be between 0,1 and 1 (default is 0,5).',
    validate: {
      float: {
        min: 0.1,
        max: 1
      }
    }
  }
})

ProductItemForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  onSkip: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  submitSucceeded: React.PropTypes.bool,
  dirty: React.PropTypes.bool,
  suppliers: React.PropTypes.object,
  product: React.PropTypes.object,
  usedSKU: React.PropTypes.string
}

export default reduxForm({
  validate
})(ProductItemForm)
