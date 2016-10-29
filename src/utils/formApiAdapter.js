function formApiAdapter (dispatch, actionCreator) {
  return (...args) =>
    new Promise((resolve, reject) => {
      dispatch(actionCreator(...args)).then(response => {
        if (response.error) {
          reject({ _error: response.payload.response.message })
        } else {
          resolve(response)
        }
      })
    })
}

export default formApiAdapter
