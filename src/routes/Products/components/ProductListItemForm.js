import React from 'react'
import { reduxForm, Field } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Button, Alert } from 'react-bootstrap'
import FormInput from '../../../components/FormInput'

/* eslint-disable camelcase */
const ProductListItemForm = ({
  error, handleSubmit, submitting
}) => (
  <form onSubmit={handleSubmit} className={'row'}>

    <Field
      name='supplier_product_code'
      component={FormInput}
      label='SKU'
      type='text'
      description='The product code associated with the supplier.'
      className={'col-xs-12 col-md-6'} />

    <Field
      name='par_level'
      component={FormInput}
      label='Par Level'
      type='number'
      description='The minimum quantity that your business must keep on hand.'
      className={'col-xs-12 col-md-6'} />

    <div className={'col-xs-12'}>
      {error &&
        <Alert bsStyle='danger'>
          <strong>Woops!</strong> {error}
        </Alert>
      }
      <Button className={'pull-right'} type='submit' disabled={submitting}>
        Save
      </Button>
    </div>
  </form>
)
/* eslint-enable camelcase */

const { validate } = buildSchema({
  par_level: {
    label: 'This',
    type: 'decimal'
  }
})

ProductListItemForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.object
}

export default reduxForm({
  validate
})(ProductListItemForm)
