import React from 'react'
import { reduxForm, Field } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Button, Alert, Row } from 'react-bootstrap'
import FormInput from '../../../components/FormInput'
import FormSelect from '../../../components/FormSelect'

const ProductListItemForm = ({
  error, submitSucceeded, handleSubmit, submitting, handleDelete, dirty, suppliers
}) => (
  <form onSubmit={handleSubmit}>
    <Row>
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
    </Row>

    {
      // <Field
      //   name='sale_unit_size'
      //   component={FormInput}
      //   label='Serving Measure'
      //   type='number'
      //   addon='ml'
      //   description='The base serving measure for the product.'
      //   className={'col-xs-12 col-md-3'} />
      //
      // <Field
      // name='sale_price'
      // component={FormInput}
      // label='Sale Price / Measure'
      // type='number'
      // addon='£'
      // description='The price at which the product will be sold.'
      // className={'col-xs-12 col-md-3'} />
    }
    <Row>
      <Field
        name='cost_price'
        component={FormInput}
        label='Cost Price'
        type='number'
        addon='£'
        description='The price at which the product have been bought.'
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
        addon='%'
        component={FormInput}
        label='Order Threshold'
        type='number'
        description='Re-order the product if the open bottle is below this level.'
        className={'col-xs-12 col-md-4'} />
    </Row>
    <Row>
      <Field
        name='count_by'
        component={FormSelect}
        label='Count by'
        type='select'
        description='The unit of which the product should be counted by during stocktake.'
        valueKey='name'
        options={[
          { name: 'bottle' },
          { name: 'keg' },
          { name: 'case' },
          { name: 'piece' },
          { name: 'pack' },
          { name: 'box' }
        ]}
        className={'col-xs-12 col-md-4'} />
    </Row>

    <div className={'col-xs-12'}>
      {error &&
        <Alert bsStyle='danger'>
          <strong>Woops!</strong> {error}
        </Alert>
      }
      {submitSucceeded && !submitting && !dirty &&
        <Alert bsStyle='success'>
          <strong>Success!</strong> Your changes have been saved successfully.
        </Alert>
      }
      <div className='product-form-footer'>
        <Button bsStyle='danger' onClick={handleDelete} disabled={submitting}>
          Delete
        </Button>
        <Button type='submit' disabled={submitting || !dirty}>
          Save
        </Button>
      </div>
    </div>
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
      int: {
        min: 0,
        max: 100
      }
    }
  },
  count_by:{
    required: true,
    error: 'This must be set.'
  }
})

ProductListItemForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  submitSucceeded: React.PropTypes.bool,
  dirty: React.PropTypes.bool,
  suppliers: React.PropTypes.object
}

export default reduxForm({
  validate
})(ProductListItemForm)
