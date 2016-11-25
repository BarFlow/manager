import React from 'react'

const ReportView = ({ params }) => (
  <div>
    ReportView for id: {params.id}
  </div>
)

ReportView.propTypes = {
  params: React.PropTypes.object
}

export default ReportView
