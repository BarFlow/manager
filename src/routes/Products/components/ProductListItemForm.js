import React from 'react'
import { reduxForm } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Button, Alert } from 'react-bootstrap'
import Field from '../../../components/FormField'

/* eslint-disable camelcase */
const ProductListItemForm = ({
  fields: { supplier_product_code, par_level, _id },
  error, handleSubmit, submitting
}) => (
  <form onSubmit={handleSubmit} className={'row'}>

    <Field
      field={supplier_product_code}
      label='SKU'
      description='The product code associated with the supplier.'
      className={'col-xs-12 col-md-6'} />

    <Field
      field={par_level}
      label='Par Level'
      description='The minimum quantity that your business must keep on hand.'
      type='number'
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

const { validate, fields } = buildSchema({
  par_level: {
    label: 'This',
    type: 'decimal'
  },
  supplier_product_code: {
    required: false
  },
  _id: {
    required: false
  }
})

ProductListItemForm.propTypes = {
  fields   : React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.object
}

export default reduxForm({
  fields,
  validate
})(ProductListItemForm)
