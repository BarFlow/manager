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
  }

  _handleUpload (e) {
    e.preventDefault()
    this.setState({
      submitting: true
    })
    const data = new FormData()
    data.append('image', this.refs.file.files[0])
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

  render () {
    const { images, error, submitting } = this.state
    return (
      <div className='image-select'>
        {images.normal &&
          <img src={images.normal} className='preview' />
        }
        {error.message &&
          <Alert bsStyle='danger'>{error.message}</Alert>
        }
        <form onSubmit={this._handleUpload}>
          <input type='file' ref='file' disabled={submitting} />
          <Button type='submit' disabled={submitting}>
            {!submitting ? (
              'Upload'
            ) : (
              <span><span className='glyphicon glyphicon-refresh spinning' /> Uploading</span>
            )}
          </Button>
        </form>
      </div>
    )
  }
}

ImageSelect.propTypes = {
  back: React.PropTypes.func.isRequired,
  next: React.PropTypes.func.isRequired,
  token: React.PropTypes.string.isRequired
}

export default ImageSelect
