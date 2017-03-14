import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, formValueSelector } from 'redux-form'
import { Alert, Button } from 'react-bootstrap'
import FormDatePicker from '../../../components/FormDatePicker'
import FormCheckbox from '../../../components/FormCheckbox'
import FormTextArea from '../../../components/FormTextArea'

const Form = ({
  error, submitSucceeded, handleSubmit, submitting, dirty, state, initialValues
}) => (
  <form onSubmit={handleSubmit}>
    <div className='order-details'>
      {initialValues.orders.map((order, index) =>
        <div key={index}>
          <h5>
            {order.supplier && order.supplier.name ? order.supplier.name : 'Supplier not set'}
            {' '}
            (£{order.subTotal})
          </h5>
          <Field
            name={`orders[${index}].req_delivery_date`}
            component={FormDatePicker}
            label='Delivery Date'
            type='text'
            description='The requested date for the delivery.' />
          {!!order.supplier && !!order.supplier.email &&
          <Field
            name={`orders[${index}].send`}
            component={FormCheckbox}
            label='Place Order'
            option='Send order to supplier via BarFlow'
            description='Select this if you want BarFlow to send out this order for you.' />
          }
          {state && state[index].send &&
          <Field
            name={`orders[${index}].delivery_note`}
            component={FormTextArea}
            label='Delivery Note'
            description='Note for the supplier (optional).' />
          }
        </div>
      )}
    </div>
    {error &&
      <Alert bsStyle='danger'>
        <strong>Woops!</strong> {error}
      </Alert>
    }
    <div className='form-footer'>
      <Button
        type='submit'
        bsStyle='primary'
        disabled={submitting || !dirty}>
        {(submitting) ? 'Loading...' : 'Submit'}
      </Button>
    </div>
  </form>
)

const validate = (values) => {
  const errors = values.orders.reduce((mem, item, index) => {
    if (!item.req_delivery_date) {
      mem.orders[index] = {
        req_delivery_date : 'Required.'
      }
    }
    return mem
  }, { orders: [] })
  return errors
}

Form.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
  submitting: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  submitSucceeded: React.PropTypes.bool,
  dirty: React.PropTypes.bool,
  initialValues: React.PropTypes.object,
  state: React.PropTypes.array
}

const OrderDetailsForm = reduxForm({
  validate,
  form: 'OrderDetailsForm'
})(Form)

const selector = formValueSelector('OrderDetailsForm')

export default connect(state => ({
  state: selector(state, 'orders')
}))(OrderDetailsForm)
