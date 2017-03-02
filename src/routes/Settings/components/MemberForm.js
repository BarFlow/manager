import React from 'react'
import { reduxForm, Field } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Alert, Button, Row } from 'react-bootstrap'

import FormInput from '../../../components/FormInput'
import FormSelect from '../../../components/FormSelect'

const VenueProfileForm = ({
  error, submitSucceeded, handleSubmit, submitting, dirty, isUpdate, onCancel
}) => (
  <form onSubmit={handleSubmit}>
    {error &&
      <Alert bsStyle='danger'>
        <strong>Woops!</strong> {error}
      </Alert>
    }
    {submitSucceeded && !submitting && !dirty &&
    <Alert bsStyle='success'>
      <strong>Success!</strong> Your changes have been saved successfully.
    </Alert>}
    <Row>
      <Field
        name='email'
        component={FormInput}
        label='Email'
        type='text'
        description='The email address of this user.'
        disabled={isUpdate}
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='role'
        component={FormSelect}
        label='Role'
        type='select'
        description='The role of this person at your establishment.'
        valueKey='name'
        options={[
          { name: 'owner' },
          { name: 'manager' },
          { name: 'staff' }
        ]}
        className={'col-xs-12'} />
    </Row>
    <div className='form-footer'>
      <Button disabled={submitting} onClick={onCancel}>Cancel</Button>
      <Button type='submit' bsStyle='primary' disabled={submitting || !dirty}>Save</Button>
    </div>
  </form>
)

const { validate } = buildSchema({
  role: {
    required: true,
    error: 'This field is required.'
  },
  email: {
    label: 'This',
    type: 'email',
    required: true
  }
})

VenueProfileForm.propTypes = {
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  submitSucceeded: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  dirty: React.PropTypes.bool,
  isUpdate: React.PropTypes.bool
}

export default reduxForm({
  validate
})(VenueProfileForm)
