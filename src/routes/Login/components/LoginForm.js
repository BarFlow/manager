import React from 'react'
import { reduxForm } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { FormGroup, ControlLabel, HelpBlock, FormControl, Button, Alert } from 'react-bootstrap'

const LoginForm = ({ fields: { email, password }, error, handleSubmit, submitting }) => (
  <form onSubmit={handleSubmit}>
    <FormGroup validationState={email.touched && email.error && 'error'}>
      <ControlLabel>E-mail</ControlLabel>
      <FormControl type='email' placeholder='Enter E-mail' {...email} />
      <HelpBlock>{email.touched && email.error && <div>{email.error}</div>}</HelpBlock>
    </FormGroup>
    <FormGroup validationState={password.touched && password.error && 'error'}>
      <ControlLabel>Password</ControlLabel>
      <FormControl type='password' placeholder='Enter Password' {...password} />
      <HelpBlock>{password.touched && password.error && <div>{password.error}</div>}</HelpBlock>
    </FormGroup>
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
