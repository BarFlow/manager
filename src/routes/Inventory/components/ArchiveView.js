import React, { Component } from 'react'
import { Alert, Button, Panel, Media } from 'react-bootstrap'
import './ArchiveView.scss'
import SubHeader from '../../../components/SubHeader'

class ArchiveView extends Component {
  constructor (props) {
    super(props)
    this._viewReport = this._viewReport.bind(this)
  }

  componentDidMount () {
    const { venueId, fetchReports } = this.props
    const { items, isFetching } = this.props.reports.archive
    if (
      (venueId && !items.length && !isFetching) ||
      (items[0] && items[0].venue_id !== venueId)
    ) {
      fetchReports(venueId)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { venueId, fetchReports } = this.props
    if (venueId !== nextProps.venueId) {
      fetchReports(nextProps.venueId)
    }
  }

  _viewReport (item) {
    const itemDate = new Date(item.created_at).toString().split(' ').splice(0, 5).join(' ')
    this.props.router.push({
      pathname: `/inventory/reports/${item._id}`,
      query: {
        title: itemDate
      }
    })
  }

  render () {
    const { items, isFetching } = this.props.reports.archive
    const { venueId } = this.props

    return (
      <div className='row'>
        <SubHeader
          className='bg-blue'
          left={<h3>Inventory / <span className='small'>Archive</span></h3>} />
        <div className='col-xs-12 col-sm-10 col-sm-offset-1 archive'>
          {!venueId || isFetching ? (
            <Alert bsStyle='warning'>
              Loading
            </Alert>
          ) : (
            items.length ? (
              items.map(item => {
                const itemDate = new Date(item.created_at).toString().split(' ').splice(0, 5).join(' ')
                return (
                  <Panel key={item._id}>
                    <Media>
                      <Media.Body>
                        <Media.Heading>{itemDate}</Media.Heading>
                      </Media.Body>
                      <Media.Right align='middle'>
                        <div className='actions'>
                          <Button onClick={() => this._viewReport(item)}>View</Button>
                          <Button onClick={() => alert('Excel download feature')}>Export</Button>
                        </div>
                      </Media.Right>
                    </Media>
                  </Panel>
                )
              })
            ) : (
              <Alert bsStyle='warning'>
                There are no reports saved for this venue yet.
              </Alert>
            )
          )}
        </div>
      </div>
    )
  }
}

ArchiveView.propTypes = {
  reports: React.PropTypes.object,
  router: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string,
  fetchReports: React.PropTypes.func.isRequired
}

export default ArchiveView
