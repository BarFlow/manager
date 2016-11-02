import React from 'react'
import { FormGroup, ControlLabel, HelpBlock, FormControl } from 'react-bootstrap'

const Field = ({ meta, label, input, description, type, className }) => (
  <FormGroup className={className}
    validationState={(meta.touched && meta.error) ? ('error') : undefined}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl type={type || 'text'} {...input} />
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

Field.propTypes = {
  meta : React.PropTypes.object.isRequired,
  input : React.PropTypes.object.isRequired,
  label : React.PropTypes.string,
  description : React.PropTypes.string,
  type : React.PropTypes.string,
  className : React.PropTypes.string
}

export default Field
