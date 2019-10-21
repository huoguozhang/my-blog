const Op = require('sequelize').Op
function wrapDateQuery (start_date, end_date) {
  const whereObj = {}
   if (start_date && !end_date) {
     whereObj[Op.or] = [
       {
         updated_time: {
           [Op.gte]: start_date
         }
       },
       {
         created_time: {
           [Op.gte]: start_date
         }
       }
     ]
   } else if (!start_date && end_date) {
     whereObj[Op.or] = [
       {
         created_time: {
           [Op.lte]: end_date
         }
       },
       {
         update_time: {
           [Op.lte]: end_date
         }
       }
     ]
   } else if (start_date && end_date) {
      whereObj[Op.or] = [
       {
         created_time: {
           [Op.between]: [start_date, end_date]
         }
       },
       {
         updated_time: {
           [Op.between]: [start_date. end_date]
         }
       }
     ]
   }
  return whereObj
}

function wrapSearchQuery (search, matchKeys) {
  const whereObj = {}
  if (!search) {
    return false
  }
  try {
    whereObj[Op.or] = [
      ...matchKeys.map(key => {
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
  return whereObj
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
