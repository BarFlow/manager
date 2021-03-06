import React from 'react'
import { reduxForm, Field } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Button, Alert } from 'react-bootstrap'
import FormInput from '../../../components/FormInput'

const LoginForm = ({ error, handleSubmit, submitting }) => {
  return <form onSubmit={handleSubmit} className='panel'>

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
    <div className='text-right'>
      <Button type='submit' disabled={submitting}>
        Login
      </Button>
    </div>
  </form>
}

const { validate } = buildSchema({
  email: {
    label: 'Email',
    required: true,
    type: 'email'
  },
  password: {
    label: 'Password',
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
