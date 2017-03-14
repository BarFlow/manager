import React from 'react'
import { FormGroup, ControlLabel, HelpBlock, FormControl } from 'react-bootstrap'

const Field = ({ meta, label, input, description, placeholder, className, addon, disabled }) => {
  return (
    <FormGroup className={className}
      validationState={(meta.touched && meta.error) ? ('error') : undefined}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl componentClass='textarea' placeholder={placeholder} {...input} />
      <HelpBlock>
        {meta.touched && meta.error ? (
          <div>{meta.error}</div>
          ) : (
            description && <div>{description}</div>
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
  placeholder : React.PropTypes.string,
  disabled : React.PropTypes.bool,
  className : React.PropTypes.string
}

export default Field
