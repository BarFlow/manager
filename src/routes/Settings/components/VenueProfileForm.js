import React from 'react'
import { reduxForm, Field } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Alert, Button, Row } from 'react-bootstrap'

import FormInput from '../../../components/FormInput'
import FormSelect from '../../../components/FormSelect'

const VenueProfileForm = ({
  error, submitSucceeded, handleSubmit, submitting, dirty, onCancel
}) => (
  <form onSubmit={handleSubmit}>
    <Row>
      <Field
        name='name'
        component={FormInput}
        label='Venue Name'
        type='text'
        description='The name of your business.'
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='email'
        component={FormInput}
        label='E-mail'
        type='text'
        description='The primary email address of your venue.'
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='tel'
        component={FormInput}
        label='Telephone'
        type='text'
        description='The telephone number of your venue.'
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='address'
        component={FormInput}
        label='Address'
        type='text'
        description='The address of your venue (it will be used for order sheet generations).'
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='type'
        component={FormSelect}
        label='Type'
        type='select'
        description='The type of your establishment.'
        valueKey='name'
        options={[
          { name: 'restaurant' },
          { name: 'pub' },
          { name: 'cocktail bar' },
          { name: 'hotel' },
          { name: 'club' }
        ]}
        className={'col-xs-12'} />
    </Row>
    {error &&
      <Alert bsStyle='danger'>
        <strong>Woops!</strong> {error}
      </Alert>
    }
    {submitSucceeded && !submitting && !dirty &&
    <Alert bsStyle='success'>
      <strong>Success!</strong> Your changes have been saved successfully.
    </Alert>}
    <div className='form-footer'>
      {onCancel &&
        <Button onClick={onCancel} disabled={submitting}>Cancel</Button>
      }
      <Button type='submit' bsStyle={onCancel && 'primary'} disabled={submitting || !dirty}>Save</Button>
    </div>
  </form>
)

const { validate } = buildSchema({
  name: {
    required: true,
    error: 'This field is required.'
  },
  email: {
    label: 'This',
    required: true,
    type: 'email'
  },
  tel: {
    required: true,
    error: 'This field is required.'
  },
  address: {
    required: true,
    error: 'This field is required.'
  },
  type: {
    required: true,
    error: 'This field is required.'
  }
})

VenueProfileForm.propTypes = {
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  submitSucceeded: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func,
  dirty: React.PropTypes.bool
}

export default reduxForm({
  validate
})(VenueProfileForm)
