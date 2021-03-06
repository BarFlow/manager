import React from 'react'
import { reduxForm, Field } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Alert, Button, Row } from 'react-bootstrap'

import FormInput from '../../../components/FormInput'

const UserProfileForm = ({
  error, submitSucceeded, handleSubmit, submitting, dirty
}) => (
  <form onSubmit={handleSubmit}>
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
        description='The primary email you use.'
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='password'
        component={FormInput}
        label='Password'
        type='password'
        description='Set your password.'
        className={'col-xs-12'} />
    </Row>
    <Row>
      <Field
        name='rePassword'
        component={FormInput}
        label='Password again'
        type='password'
        description='Re-enter your password.'
        className={'col-xs-12'} />
    </Row>
    {error &&
      <Alert bsStyle='danger'>
        <strong>Woops!</strong> {error}
      </Alert>
    }
    <div className='form-footer'>
      <Button bsStyle='primary' type='submit' disabled={submitting || !dirty}>Register</Button>
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
  password: {
    label: 'Password',
    required: true,
    validate: {
      length: {
        min: 6,
        max: 20
      }
    }
  },
  rePassword: {
    required: true,
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
