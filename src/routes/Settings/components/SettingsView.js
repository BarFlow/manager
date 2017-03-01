import React, { Component } from 'react'

class SettingsView extends Component {
  render () {
    return <div>
      <h1>Settings</h1>
    </div>
  }
}

SettingsView.propTypes = {
  venues: React.PropTypes.object.isRequired
}

export default SettingsView
