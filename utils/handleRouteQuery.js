const Op = require('sequelize').Op
const moment = require('moment')
function wrapDateQuery (start_date, end_date) {
  const whereObj = {}
  let startDate = moment(start_date || new Date()).format('YYYY-MM-DD 00:00:00')
  let endDate = moment(end_date || new Date()).format('YYYY-MM-DD 23:59:59')
  if (start_date && !end_date) {
    whereObj[Op.or] = [
      {
        updated_time: {
          [Op.gte]: startDate
        }
      },
      {
        created_time: {
          [Op.gte]: startDate
        }
      }
    ]
  } else if (!start_date && end_date) {
    whereObj[Op.or] = [
      {
        created_time: {
          [Op.lte]: endDate
        }
      },
      {
        updated_time: {
          [Op.lte]: endDate
        }
      }
    ]
  } else if (start_date && end_date) {
    whereObj[Op.or] = [
      {
        created_time: {
          [Op.between]: [startDate, endDate]
        }
      },
      {
        updated_time: {
          [Op.between]: [startDate.endDate]
        }
      }
    ]
  }
  return whereObj
}

function wrapSearchQuery (search, matchKeys) {
  const whereObj = {}
  if (!search) {
    return whereObj
  }
  try {
    whereObj[Op.or] = [
      ...matchKeys.map((key) => {
        return {
          [key]: {
            [Op.substring]: search
          }
        }
      })
    ]
  } catch (e) {
    throw e
  }
  return { [Op.and]: whereObj }
}

function wrapUserQuery (search) {
  const whereObj = {}
  if (!search) {
    return whereObj
  }
  whereObj[Op.or] = [
    {
      nickname: {
        [Op.substring]: search
      }
    }
  ]
  return whereObj
}

module.exports = { wrapDateQuery, wrapSearchQuery, wrapUserQuery }
