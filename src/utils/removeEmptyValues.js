export default (obj) =>
  Object.assign(...Object.keys(obj).map(key =>
    (obj[key] !== undefined && obj[key] !== null) && { [key]: obj[key] }))
