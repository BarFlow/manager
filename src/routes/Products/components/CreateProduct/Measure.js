import React, { Component } from 'react'
import { Button } from 'react-bootstrap'

class Measure extends Component {
  constructor (props) {
    super(props)

    this.state = {
      measurable_from: 0.2,
      measurable_till: 0.8,
      error: {}
    }

    this._handleNext = this._handleNext.bind(this)
    this.onMousedown = this.onMousedown.bind(this)
    this.onMousemove = this.onMousemove.bind(this)
    this.onMouseup = this.onMouseup.bind(this)
  }

  componentDidMount () {
    this.setState({
      measurable_from: this.props.product.measurable_from,
      measurable_till: this.props.product.measurable_till
    })
    var canvas = this.refs.canvas
    canvas.addEventListener('mousemove', this.onMousemove, false)
    document.addEventListener('mouseup', this.onMouseup, false)
  }

  onMousemove (e) {
    let mPosy = 0
    let ePosy = 0
    let obj = this.refs.canvas
    // get mouse position on document crossbrowser
    if (!e) { e = window.event }
    if (e.pageX || e.pageY) {
      mPosy = e.pageY
    } else if (e.clientX || e.clientY) {
      mPosy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop
    }
    // get parent element position in document
    if (obj.offsetParent) {
      do {
        ePosy += obj.offsetTop
      } while (obj = obj.offsetParent) // eslint-disable-line
    }
    // mouse position minus elm position is mouseposition relative to element:
    if (this.activeLine) {
      this.activeLine.pos = 1 - ((mPosy - ePosy - 1) / this.refs.canvas.offsetHeight)
      this.activeLine.style['top'] = (mPosy - ePosy - 1) + 'px'
    }
  }

  onMouseup (e) {
    if (this.activeLine) {
      this.setState({
        [this.activeLine.id]: this.activeLine.pos
      })
      this.activeLine = null
    }
  }

  onMousedown (e) {
    this.activeLine = e.currentTarget
  }

  _handleNext () {
    const { next } = this.props
    next({
      measurable_from: this.state.measurable_from,
      measurable_till: this.state.measurable_till
    })
  }

  render () {
    const { back, product } = this.props
    const { measurable_from: measurableFrom, measurable_till: measurableTill } = this.state
    return (
      <div className='measure'>
        <label>Measurable points</label>
        <p>Set the minimum and maximum level of the liquid on the picture below.</p>
        <div ref='canvas' className='canvas' style={{ backgroundImage: `url(${product.images.normal})` }}>
          <div
            id='measurable_till'
            onMouseDown={this.onMousedown}
            style={{ top: (1 - measurableTill) * 100 + '%' }}
            className='line'>
            <span>Max.</span>
            <span className='pull-right' />
          </div>
          <div
            id='measurable_from'
            onMouseDown={this.onMousedown}
            style={{ top: (1 - measurableFrom) * 100 + '%' }}
            className='line'>
            <span>Min.</span>
            <span className='pull-right' />
          </div>
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
