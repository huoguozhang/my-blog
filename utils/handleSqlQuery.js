const moment = require('moment')
function wrapIncludeObject (v, modelName) {
  Object.keys(v).forEach((key) => {
    if (/\w+\.\w+/.test(key)) {
      const newKey = key.split('.')[ 1 ]
      if (!v[ modelName ]) {
        v[ modelName ] = {}
      }
      v[ modelName ][ newKey ] = v[ key ]
      delete v[ key ]
    }
  })
}

function wrapDateQuery (model, start_date, end_date) {
  if (!start_date && !end_date) {
    return ''
  }
  const startRawDate = moment(start_date || new Date()).format('YYYY-MM-DD')
  const endRawDate = moment(end_date || new Date()).format('YYYY-MM-DD')
  let result = ''
  if (start_date && !end_date) {
    result = `${model}.updated_time >= '${startRawDate}' OR ${model}.created_time >= '${startRawDate}'`
  } else if (!start_date && end_date) {
    result = `${model}.updated_time <= DATE('${endRawDate}') OR ${model}.created_time <= DATE('${endRawDate}')`
  } else if (start_date && end_date) {
    result = `(${model}.updated_time BETWEEN '${startRawDate}' AND '${endRawDate}') OR (${model}.created_time BETWEEN '${startRawDate}' AND '${endRawDate}')`
  }
  return `AND (${result})`
}

module.exports = {
  wrapIncludeObject,
  wrapDateQuery
}
