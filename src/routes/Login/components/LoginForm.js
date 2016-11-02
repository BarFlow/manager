import React from 'react'
import { reduxForm } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { Button, Alert } from 'react-bootstrap'
import Field from '../../../components/FormField'

const LoginForm = ({ fields: { email, password }, error, handleSubmit, submitting }) => (
  <form onSubmit={handleSubmit}>

    <Field
      field={email}
      label='E-mail'
      type='email' />

    <Field
      field={password}
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
)

const { validate, fields } = buildSchema({
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
  fields   : React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.object
}

export default reduxForm({
  form: 'login',
  fields,
  validate
})(LoginForm)
