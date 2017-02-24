import React, { Component } from 'react'
import { Media, Label, Panel, Collapse, Alert } from 'react-bootstrap'
import { Link } from 'react-router'
import pluralize from 'pluralize'

class ProductListItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false
    }

    this._toggleCollapse = this._toggleCollapse.bind(this)
  }

  _toggleCollapse () {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render () {
    const { name, category, sub_category: subCategory, capacity, images } = this.props.item.product_id
    const { item } = this.props

    const round = (value) =>
      Math.round(value * 100) / 100

    return (
      <Panel onClick={this._toggleCollapse}>
        <Media>
          <Media.Left>
            <div>
              <img src={images && images.thumbnail} alt={name} />
            </div>
          </Media.Left>
          <Media.Body>
            <Media.Heading>{name}</Media.Heading>
            <p>
              <Label>{category}</Label>
              {subCategory && subCategory !== 'other' &&
                <Label>{subCategory}</Label>
              }
              <Label>{capacity} ml</Label>
              {item.cost_price !== undefined &&
                <Label>£{item.cost_price}</Label>
              }
              {item.supplier_id &&
                <Label>{item.supplier_id.name}</Label>
              }
              {!item.areas.length &&
                <Label bsStyle='danger'>Area/Section</Label>
              }
            </p>
          </Media.Body>
          <Media.Right align='middle'>
            <div className='stats'>
              <div className={item.order > 0 && 'low'}>
                <label>Stock Level</label>
                <p>{round(item.volume)}</p>
                <span>{pluralize(item.count_by || 'bottle', item.volume <= 1 ? 1 : 2)}</span>
              </div>
              <div>
                <label>Par Level</label>
                <p>{!item.par_level && item.par_level !== 0 ? 'n/a' : round(item.par_level)}</p>
                <span>{pluralize(item.count_by || 'bottle', item.par_level <= 1 ? 1 : 2)}</span>
              </div>
              <div>
                <label>Value</label>
                {item.cost_price !== undefined &&
                  <p>£{item.value}</p>
                }
                {!item.cost_price &&
                  <p>n/a</p>
                }
              </div>
            </div>
          </Media.Right>
          <Collapse in={this.state.isOpen}>
            <div>
              <hr />
              {item.areas.map(area =>
                <div className='area' key={area._id}>
                  <div className='area-row'>
                    <span className='name'>{area.name}</span>
                    <span className='volume pull-right'>{round(area.volume)}</span>
                  </div>
                  {area.sections.map(section =>
                    <div className='section-row' key={section._id}>
                      <span className='name'>{section.name}</span>
                      <span className='volume pull-right'>{round(section.volume)}</span>
                    </div>
                  )}
                </div>
              )}
              {!item.areas.length &&
                <Alert bsStyle='warning'>
                  <strong>Warning!</strong> This product has not been placed under any Area/Section.
                  {' '}<Link to='/venue' className='alert-link'>Add it now</Link>.
                </Alert>
              }
            </div>
          </Collapse>
        </Media>
      </Panel>
    )
  }
}

ProductListItem.propTypes = {
  item: React.PropTypes.shape({
    _id: React.PropTypes.string.isRequired,
    product_id: React.PropTypes.shape({
      _id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      category: React.PropTypes.string.isRequired,
      sub_category: React.PropTypes.string,
      capacity: React.PropTypes.number.isRequired,
      images: React.PropTypes.object
    })
  })
}
export default ProductListItem
