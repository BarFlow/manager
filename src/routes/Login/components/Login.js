import React from 'react'

export const Counter = (props) => (
  <div style={{ margin: '0 auto' }} >
    <button className='btn btn-default' onClick={() => {
      props.userLogin({ email:'demo@barflow.io', password: 'demo' })
    }}>
      Login
    </button>
  </div>
)

Counter.propTypes = {
  userLogin   : React.PropTypes.func.isRequired
}

export default Counter
