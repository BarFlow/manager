import React from 'react'
import { reduxForm } from 'redux-form'
import buildSchema from 'redux-form-schema'
import { FormGroup, ControlLabel, HelpBlock, FormControl, Button, Alert } from 'react-bootstrap'

const ProductListItemForm = ({
  fields: { supplier_product_code, par_level, _id },
  error, handleSubmit, submitting
}) => (
  <form onSubmit={handleSubmit}>
    <FormGroup validationState={supplier_product_code.touched && supplier_product_code.error && 'error'}>
      <ControlLabel>SKU</ControlLabel>
      {/*eslint-disable*/}
      <FormControl type='text' {...supplier_product_code} />
      {/*eslint-enable*/}
      <HelpBlock>
        {supplier_product_code.touched && supplier_product_code.error && <div>{supplier_product_code.error}</div>}
      </HelpBlock>
    </FormGroup>

    <FormGroup validationState={par_level.touched && par_level.error && 'error'}>
      <ControlLabel>Par Level</ControlLabel>
      {/*eslint-disable*/}
      <FormControl type='text' {...par_level} />
      {/*eslint-enable*/}
      <HelpBlock>{par_level.touched && par_level.error && <div>{par_level.error}</div>}</HelpBlock>
    </FormGroup>

    {error &&
      <Alert bsStyle='danger'>
        <strong>Woops!</strong> {error}
      </Alert>
    }
    <Button type='submit' disabled={submitting}>
      Save
    </Button>
  </form>
)

const { validate, fields } = buildSchema({
  par_level: {
    label: 'Par level',
    type: 'int'
  },
  supplier_product_code: {
    required: false
  },
  _id: {
    required: false
  }
})

ProductListItemForm.propTypes = {
  fields   : React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.object
}

export default reduxForm({
  fields,
  validate
})(ProductListItemForm)
