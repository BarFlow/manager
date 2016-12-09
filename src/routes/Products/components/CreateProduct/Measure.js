import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

class Measure extends Component {
  constructor (props) {
    super(props)

    this.state = {
      measurable_from: 0,
      measurable_till: 1,
      error: {}
    }

    this._handleNext = this._handleNext.bind(this)
    this._handleDrag = this._handleDrag.bind(this)
    this.onMousemove = this.onMousemove.bind(this)
  }

  componentDidMount () {
    var canvas = this.refs.canvas
    canvas.addEventListener('mousemove', this.onMousemove, false)
    document.addEventListener('mouseup', () => {
      this.activeLine = null
    }, false)
  }

  onMousemove (e) {
    let mPosx = 0
    let mPosy = 0
    let ePosx = 0
    let ePosy = 0
    let obj = this.refs.canvas
    // get mouse position on document crossbrowser
    if (!e) { e = window.event }
    if (e.pageX || e.pageY) {
      mPosx = e.pageX
      mPosy = e.pageY
    } else if (e.clientX || e.clientY) {
      mPosx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
      mPosy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
    }
    // get parent element position in document
    // console.log(obj.offsetParent);
    if (obj.offsetParent) {
      do {
        ePosx += obj.offsetLeft
        ePosy += obj.offsetTop
      } while (obj = obj.offsetParent)
    }
    // mouse position minus elm position is mouseposition relative to element:
    console.log(' X Position: ' + (mPosx - ePosx) + ' Y Position: ' + (mPosy - ePosy))
    if (this.activeLine) {
      this.activeLine.style['top'] = (mPosy - ePosy - 1) + 'px'
    }
  }

  _handleDrag (e) {
    this.activeLine = e.currentTarget
  }

  _handleNext () {
    const { product, next } = this.props
    next(product)
  }

  render () {
    const { measurable_from: measurableFrom, measurable_till: measurableTill } = this.state
    const { back, product } = this.props

    return (
      <div className='measure'>
        <label>Product Image</label>
        <div ref='canvas' className='canvas' style={{ backgroundImage: `url(${product.images.normal})` }}>
          <div
            onMouseDown={this._handleDrag}
            className='line measurable-till'><span>Maximum</span><span className='pull-right' /></div>
          <div
            onMouseDown={this._handleDrag}
            className='line measurable-from'><span>Minimum</span><span className='pull-right' /></div>
        </div>
        <div className='product-create-footer'>
          <Button onClick={back}>
            Back
          </Button>
          <Button onClick={this._handleNext} bsStyle='primary'>
            Next
          </Button>
        </div>
      </div>
    )
  }
}

Measure.propTypes = {
  back: React.PropTypes.func.isRequired,
  next: React.PropTypes.func.isRequired,
  product: React.PropTypes.object
}

export default Measure
