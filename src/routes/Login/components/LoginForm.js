import React from 'react'
import { reduxForm, Field } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Button, Alert } from 'react-bootstrap'
import FormInput from '../../../components/FormInput'

const LoginForm = ({ error, handleSubmit, submitting }) => {
  return <form onSubmit={handleSubmit}>

    <Field
      name='email'
      component={FormInput}
      label='E-mail'
      type='email' />

    <Field
      name='password'
      component={FormInput}
      label='Password'
      type='password' />

    {error &&
      <Alert bsStyle='danger'>
        <strong>Woops!</strong> {error}
      </Alert>
    }
    <Button type='submit' disabled={submitting}>
      Login
    </Button>
  </form>
}

const { validate } = buildSchema({
  email: {
    label: 'This',
    required: true,
    type: 'email'
  },
  password: {
    label: 'This',
    required: true
  }
})

LoginForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.object
}

export default reduxForm({
  form: 'login',
  validate
})(LoginForm)
