import React from 'react'
import { reduxForm, Field } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Alert, Button, Row } from 'react-bootstrap'

import FormInput from '../../../components/FormInput'

const UserProfileForm = ({
  error, submitSucceeded, handleSubmit, submitting, dirty
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
        name='name'
        component={FormInput}
        label='Name'
        type='text'
        description='Your name.'
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='email'
        component={FormInput}
        label='E-mail'
        type='text'
        description='The primary email you use (used to log-in and acces all your venues).'
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='password'
        component={FormInput}
        label='New password'
        type='password'
        description='Fill this to change your current password.'
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='rePassword'
        component={FormInput}
        label='New password again'
        type='password'
        description='Fill this to change your current password.'
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='current_password'
        component={FormInput}
        label='Current Password'
        type='password'
        description='Enter your current password.'
        className={'col-xs-12'} />
    </Row>
    <div className='form-footer'>
      <Button bsStyle='primary' type='submit' disabled={submitting || !dirty}>Save</Button>
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
  current_password: {
    required: true,
    error: 'You must enter your current password to make changes.'
  },
  password: {
    label: 'Password',
    validate: {
      length: {
        min: 6,
        max: 20
      }
    }
  },
  rePassword: {
    validate: {
      passMatch: (fields, fieldValue) => {
        return fields.password === fieldValue
      }
    },
    error: 'Passwords do not match.'
  }
})

UserProfileForm.propTypes = {
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  submitSucceeded: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func.isRequired,
  dirty: React.PropTypes.bool
}

export default reduxForm({
  validate
})(UserProfileForm)
