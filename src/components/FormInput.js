import React from 'react'
import { FormGroup, ControlLabel, HelpBlock, FormControl, InputGroup } from 'react-bootstrap'

const Field = ({ meta, label, input, description, type, className, addon, disabled }) => {
  const Formcontrol = addon
  ? <InputGroup>
    <InputGroup.Addon>{addon}</InputGroup.Addon>
    <FormControl type={type || 'text'} {...input} disabled={disabled} />
  </InputGroup>
  : <FormControl type={type || 'text'} {...input} disabled={disabled} />

  return (
    <FormGroup className={className}
      validationState={(meta.touched && meta.error) ? ('error') : undefined}>
      <ControlLabel>{label}</ControlLabel>
      {Formcontrol}
      <HelpBlock>
        {meta.touched && meta.error ? (
          <div>{meta.error}</div>
          ) : (
            <div>{description}</div>
          )
        }
      </HelpBlock>
    </FormGroup>
  )
}

Field.propTypes = {
  meta : React.PropTypes.object.isRequired,
  input : React.PropTypes.object.isRequired,
  label : React.PropTypes.string,
  addon : React.PropTypes.string,
  description : React.PropTypes.string,
  type : React.PropTypes.string,
  disabled : React.PropTypes.bool,
  className : React.PropTypes.string
}

export default Field
