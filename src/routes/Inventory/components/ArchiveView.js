import React, { Component } from 'react'
import { Alert } from 'react-bootstrap'
import { Link } from 'react-router'
import './ArchiveView.scss'
import SubHeader from '../../../components/SubHeader'

class ArchiveView extends Component {
  componentDidMount () {
    const { venueId, fetchReports } = this.props
    const { items, isFetching } = this.props.reports.archive
    if (venueId && !items.length && !isFetching) {
      fetchReports(venueId)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { venueId, fetchReports } = this.props
    if (venueId !== nextProps.venueId) {
      fetchReports(nextProps.venueId)
    }
  }

  render () {
    const { items, isFetching } = this.props.reports.archive

    return (
      <div className='row'>
        <SubHeader
          className='bg-blue'
          left={<h3>Inventory / <span className='small'>Archive</span></h3>} />
        <div className='col-xs-12 col-sm-10 col-sm-offset-1 archive'>
          {isFetching ? (
            <Alert bsStyle='warning'>
              <strong>Loading</strong> Fetching saved reports.
            </Alert>
          ) : (
            items.length ? (
              items.map(item => {
                const itemDate = new Date(item.created_at).toString().split(' ').splice(0, 5).join(' ')
                return <Link key={item._id} to={`/inventory/reports/${item._id}?title=${itemDate}`}>
                  <div className='panel panel-default'>
                    {itemDate}
                  </div>
                </Link>
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
  venueId: React.PropTypes.string,
  fetchReports: React.PropTypes.func.isRequired
}

export default ArchiveView
