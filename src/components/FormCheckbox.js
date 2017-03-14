import React from 'react'
import { FormGroup, ControlLabel, Checkbox, HelpBlock } from 'react-bootstrap'

const FormCheckbox = ({ meta, input, className, description, label, disabled, option }) =>
  <FormGroup className={className}
    validationState={(meta.touched && meta.error) ? ('error') : undefined}>
    <ControlLabel>{label}</ControlLabel>
    <Checkbox checked={input.value} {...input} disabled={disabled}>
      {option}
    </Checkbox>
    <HelpBlock>
      {meta.touched && meta.error ? (
        <div>{meta.error}</div>
        ) : (
          <div>{description}</div>
        )
      }
    </HelpBlock>
  </FormGroup>

FormCheckbox.propTypes = {
  input: React.PropTypes.object,
  meta: React.PropTypes.object,
  label : React.PropTypes.string,
  option: React.PropTypes.string,
  description : React.PropTypes.string,
  disabled : React.PropTypes.bool,
  className : React.PropTypes.string
}

export default FormCheckbox
