import React, { Component } from 'react'
import { Alert, Button } from 'react-bootstrap'

class Review extends Component {
  constructor (props) {
    super(props)

    this.state = {
      submitting: false,
      submitted: false,
      error: ''
    }

    this._handleSubmit = this._handleSubmit.bind(this)
  }

  _handleSubmit () {
    this.setState({
      submitting: true
    })

    this.props.submit().then(() => {
      this.setState({
        submitting: false,
        submitted: true
      })
    })
    .catch(err => this.setState({ error: err.errors._error }))
  }

  render () {
    const { product, back } = this.props
    return (
      <div className='review'>
        <label>Review</label>
        <p>Please make sure that all details are correct.</p>
        <div className='row'>
          <div className='col-xs-6'>
            <p className='preview'><img src={product.images.normal} /></p>
          </div>
          <div className='col-xs-6'>
            <div className='well'>
              <label>Name:</label>
              <p>{product.name}</p>
              <label>Category:</label>
              <p>{product.category} {product.sub_category}</p>
              <label>Capacity:</label>
              <p>{product.capacity} ml</p>
              <label>Measurable:</label>
              <p>{product.measurable ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
        <div className='product-create-footer'>
          {this.state.error &&
            <Alert bsStyle='danger'><strong>Ooops!</strong> {this.state.error}</Alert>
          }
          {!this.state.submitted &&
            <div>
              <Button onClick={back} disabled={this.state.submitting}>
              Back
              </Button>
              <Button onClick={this._handleSubmit} disabled={this.state.submitting} bsStyle='primary'>
              Submit
              </Button>
            </div>
          }
          {this.state.submitted &&
            <Alert bsStyle='success'><strong>Success!</strong> The product has been added sucessfully.</Alert>
          }
        </div>
      </div>
    )
  }
}

Review.propTypes = {
  back: React.PropTypes.func.isRequired,
  submit: React.PropTypes.func.isRequired,
  product: React.PropTypes.object
}

export default Review
