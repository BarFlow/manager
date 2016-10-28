import React from 'react'
import { reduxForm } from 'redux-form'
import buildSchema from 'redux-form-schema'

const LoginForm = ({ fields: { email, password }, error, handleSubmit, submitting }) => (
  <form onSubmit={handleSubmit}>
    <div>
      <input type='text' placeholder='E-mail' {...email} />
      {email.touched && email.error && <div>{email.error}</div>}
    </div>
    <div>
      <input type='password' placeholder='Password' {...password} />
      {password.touched && password.error && <div>{password.error}</div>}
    </div>
    {error && <div>{error}</div>}
    <button type='submit' disabled={submitting}>
      Login
    </button>
  </form>
)

const { validate, fields } = buildSchema({
  email: {
    label: 'E-mail',
    required: true,
    type: 'email'
  },
  password: {
    label: 'Password',
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
