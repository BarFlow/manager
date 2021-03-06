import React, { Component } from 'react'
import { Alert, Button, Panel, Media, Modal, Label } from 'react-bootstrap'
import SubHeader from '../../../components/SubHeader'
import './ArchiveView.scss'

class ArchiveView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      item: {},
      isDialogOpen: false
    }
    this._viewReport = this._viewReport.bind(this)
    this._toggleConfirmDialog = this._toggleConfirmDialog.bind(this)
    this._handleDelete = this._handleDelete.bind(this)
    this._deleteReport = this._deleteReport.bind(this)
  }

  componentDidMount () {
    const { venueId, fetchReports } = this.props
    const { items, isFetching } = this.props.reports.archive
    if (
      (venueId && !items.length && !isFetching) ||
      (items[0] && items[0].venue_id !== venueId)
    ) {
      fetchReports(venueId)
    } else if (items[0] && items[0].venue_id === venueId) {
      // Silent refresh, no isFetching is triggered
      fetchReports(venueId, true)
    }
  }

  componentWillReceiveProps (nextProps) {
    const { venueId, fetchReports } = this.props
    if (venueId !== nextProps.venueId) {
      fetchReports(nextProps.venueId)
    }
  }

  _viewReport (item) {
    this.props.router.push({
      pathname: `/stock/reports/${item._id}`
    })
  }

  _toggleConfirmDialog () {
    this.setState({
      isDialogOpen: !this.state.isDialogOpen
    })
  }

  _handleDelete (item) {
    this.setState({
      item
    })
    this._toggleConfirmDialog()
  }

  _deleteReport () {
    this.props.deleteReport(this.state.item._id)
    this._toggleConfirmDialog()
  }

  render () {
    const { items, isFetching } = this.props.reports.archive
    const { venueId, reports, location } = this.props

    const confirmDialog = <Modal show={this.state.isDialogOpen}
      onHide={this._toggleConfirmDialog}
      className='delete-confirm-dialog'>
      <Modal.Header closeButton>
        <Modal.Title>Delete - {this.state.item.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to <strong>permanently remove {this.state.item.name}</strong> report from your venue?
        Please note that this action is irreversible.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this._toggleConfirmDialog}>Cancel</Button>
        <Button bsStyle='danger' onClick={this._deleteReport}>Delete</Button>
      </Modal.Footer>
    </Modal>

    return (
      <div className='row'>
        <SubHeader
          className='bg-blue'
          left={<h3>Stock Report / <span className='small'>Archive</span></h3>} />
        <div className='col-xs-12 col-sm-10 col-sm-offset-1 archive'>

          {confirmDialog}
          {location.query.saved &&
            <Alert bsStyle='success'>
              <strong>Success!</strong> Stock report has been successfuly saved.
            </Alert>
          }

          {!venueId || isFetching ? (
            <Alert bsStyle='warning'>
              Loading
            </Alert>
          ) : (
            items.length ? (
              items.map(item => {
                const itemDate = new Date(item.created_at).toString().split(' ').splice(0, 5).join(' ')
                return (
                  <Panel key={item._id} onClick={() => this._viewReport(item)}>
                    <Media>
                      <Media.Body>
                        <Media.Heading>{itemDate}</Media.Heading>
                        <Label>Created by: {item.created_by.name}</Label>
                        <Label>Total stock value: £{item.stats.total_value}</Label>
                      </Media.Body>
                      <Media.Right align='middle'>
                        <div className='actions'>
                          <Button
                            bsStyle='danger'
                            onClick={(e) => {
                              e.stopPropagation()
                              this._handleDelete({ ...item, name: itemDate })
                            }}
                            disabled={reports.isSaving}>Delete</Button>
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
  location: React.PropTypes.object.isRequired,
  venueId: React.PropTypes.string,
  fetchReports: React.PropTypes.func.isRequired,
  deleteReport: React.PropTypes.func.isRequired
}

export default ArchiveView
