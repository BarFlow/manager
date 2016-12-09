import React, { Component } from 'react'
import fetch from 'isomorphic-fetch'
import { Button, Alert } from 'react-bootstrap'

class ImageSelect extends Component {
  constructor (props) {
    super(props)

    this.state = {
      images: {},
      submitting: false,
      error: {}
    }

    this._handleUpload = this._handleUpload.bind(this)
    this._setFile = this._setFile.bind(this)
    this._handleNext = this._handleNext.bind(this)
  }

  _handleUpload (e) {
    e.preventDefault()
    this.setState({
      submitting: true
    })
    const data = new FormData()
    data.append('image', this.state.file)
    fetch('https://api.stockmate.co.uk/uploads', {
      method: 'POST',
      body: data,
      headers: {
        'Authorization': 'Bearer ' + this.props.token
      }
    })
    .then(res => res.json())
    .then(json => {
      const images = json.reduce((mem, item) => {
        mem[item.type] = item.url
        return mem
      }, {})
      this.setState({ images, submitting: false })
    })
    .catch(error => this.setState({ error }))
  }

  _setFile () {
    this.setState({
      file: this.refs.file.files[0]
    })
  }

  getCategoryDefaults (product) {
    const { category, sub_category: subCategory } = product
    const { types } = this.props
    if (subCategory) {
      return types.items.find(item =>
        item._id === types.tree.beverage.children[category].children[subCategory]._id)
    }

    return types.items.find(item => item._id === types.tree.beverage.children[category]._id)
  }

  _handleNext () {
    const { product, next } = this.props
    const { images } = this.state
    const defaults = this.getCategoryDefaults(product)
    const payload = {
      images: {
        ...defaults.images,
        ...images
      },
      measurable_from: defaults.measurable_from,
      measurable_till: defaults.measurable_till
    }
    next(payload)
  }

  render () {
    const { images, error, submitting, file } = this.state
    const { back, product } = this.props
    const defaults = this.getCategoryDefaults(product)

    return (
      <div className='image-select'>
        <div className='uploader'>
          <label>Product Image</label>
          <p className='preview'><img src={images.normal || defaults.images.normal} /></p>
          {error.message &&
            <Alert bsStyle='danger'>{error.message}</Alert>
          }
          <label>Use default or upload your own</label>
          <form onSubmit={this._handleUpload}>
            <input type='file' ref='file' disabled={submitting} accept='image/*' onChange={this._setFile} />
            {file &&
              <Button type='submit' disabled={submitting}>
                {!submitting ? (
                  'Upload'
                ) : (
                  <span><span className='glyphicon glyphicon-refresh spinning' /> Uploading</span>
                )}
              </Button>
            }
          </form>
        </div>
        <div className='product-create-footer'>
          <Button onClick={back} disabled={submitting}>
            Back
          </Button>
          <Button onClick={this._handleNext} bsStyle='primary' disabled={submitting}>
            Next
          </Button>
        </div>
      </div>
    )
  }
}

ImageSelect.propTypes = {
  back: React.PropTypes.func.isRequired,
  next: React.PropTypes.func.isRequired,
  token: React.PropTypes.string.isRequired,
  product: React.PropTypes.object,
  types: React.PropTypes.object
}

export default ImageSelect
