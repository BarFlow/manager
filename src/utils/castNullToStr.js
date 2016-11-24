export default (obj) =>
  Object.assign(...Object.keys(obj).map(key =>
    obj[key] === null ? { [key]: '' } : { [key]: obj[key] }
  ))
