const moment = require('moment')
function wrapIncludeObject (v, modelName) {
  Object.keys(v).forEach(key => {
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

function wrapDateQuery (start_date, end_date) {
  if (!start_date && !end_date) {
    return ''
  } else {
  }
  let result = ''
  if (start_date && !end_date) {
    result = `updated_time >= ${start_date} OR created_time >= ${start_date}`
  } else if (!start_date && end_date) {
    result = `updated_time <= ${end_date} OR created_time <= ${end_date}`
  } else if (start_date && end_date) {
    result = `(updated_time BETWEEN　${moment(start_date).format('YYYY-MM-DD')}
     AND ${moment(end_date).format('YYYY-MM-DD')})`
  }
  return `AND (${result})`
}

module.exports = {
  wrapIncludeObject,
  wrapDateQuery
}
