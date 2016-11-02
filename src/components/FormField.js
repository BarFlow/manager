import React from 'react'
import { FormGroup, ControlLabel, HelpBlock, FormControl } from 'react-bootstrap'

const Field = ({ field, label, description, formControl, type }) => (
  <FormGroup className={'col-xs-12 col-md-6'}
    validationState={field.touched && field.error && 'error'}>
    <ControlLabel>{label}</ControlLabel>
    {formControl ||
      <FormControl type={type || 'text'} {...field} />
    }
    <HelpBlock>
      {field.touched && field.error ? (
        <div>{field.error}</div>
        ) : (
          <div>{description}</div>
        )
      }
    </HelpBlock>
  </FormGroup>
)

Field.propTypes = {
  field   : React.PropTypes.object.isRequired,
  label: React.PropTypes.string.isRequired,
  description: React.PropTypes.string,
  type: React.PropTypes.string,
  formControl: React.PropTypes.element
}

export default Field
