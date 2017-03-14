import React from 'react'
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'
import DatePicker from 'react-bootstrap-date-picker'

const Field = ({ meta, label, input, description, className, disabled }) => {
  return (
    <FormGroup className={className}
      validationState={(meta.touched && meta.error) ? ('error') : undefined}>
      <ControlLabel>{label}</ControlLabel>
      <DatePicker
        {...input}
        dateFormat={'DD/MM/YYYY'} disabled={disabled} />
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
  description : React.PropTypes.string,
  disabled : React.PropTypes.bool,
  className : React.PropTypes.string
}

export default Field
