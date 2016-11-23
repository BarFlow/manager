import React from 'react'
import { reduxForm, Field } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Button, Alert } from 'react-bootstrap'
import FormInput from '../../../components/FormInput'

const SupplierListItemForm = ({
  error, submitSucceeded, handleSubmit, submitting, handleDelete, dirty
}) => (
  <form onSubmit={handleSubmit} className={'row'}>

    <Field
      name='name'
      component={FormInput}
      label='Name'
      type='text'
      description='The name of the supplier.'
      className={'col-xs-12 col-md-6'} />

    <Field
      name='email'
      component={FormInput}
      label='E-mail'
      type='text'
      description='The email address used for placing orders'
      className={'col-xs-12 col-md-6'} />

    <Field
      name='address'
      component={FormInput}
      label='Address'
      type='text'
      description='The address of the warehouse.'
      className={'col-xs-12 col-md-6'} />

    <Field
      name='tel'
      component={FormInput}
      label='Tel'
      type='text'
      description='The tel number used for placing orders.'
      className={'col-xs-12 col-md-6'} />

    <Field
      name='account_number'
      component={FormInput}
      label='Account Number'
      type='text'
      description='The account number for your business.'
      className={'col-xs-12 col-md-6'} />

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
  name: {
    label: 'This',
    required: true
  }
})

SupplierListItemForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.object,
  submitSucceeded: React.PropTypes.bool,
  dirty: React.PropTypes.bool
}

export default reduxForm({
  validate
})(SupplierListItemForm)
