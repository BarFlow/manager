import { SubmissionError } from 'redux-form'

function formApiAdapter (dispatch, actionCreator) {
  return (...args) =>
    dispatch(actionCreator(...args)).then(response => {
      if (response.error) {
        throw new SubmissionError({ _error: response.payload.response.message })
      }
    })
}

export default formApiAdapter
