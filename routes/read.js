const Joi = require('@hapi/joi')
const models = require('../models')

const Routes = [
  {
    path: '/api/read/record',
    method: 'POST',
    handler: async (request, h) => {
      const info = request.info
      const ipReg = new RegExp(`^${info.received}\\:(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})`)
      const ip = info.id.match(ipReg)[1]
      const articleRead = await models.article_read.findAll({
        where: {
          article_uid: request.payload.article_uid,
          client_ip: ip
        }
      })
      const readRecord = articleRead[0]
      async function createReadRecord() {
        return models.article_read.create({
          client_ip: ip,
          received: info.received,
          request_id: info.id,
          article_uid: request.payload.article_uid
        })
      }
      let result = null
      if (readRecord) {
        // 如果访问记录存在
        // 如果访问间隔时间大于两个小时 插一条记录
        if (new Date(readRecord.created_time).getTime() + 1000 * 60 * 60 * 2 < info.received) {
          result = await createReadRecord()
        } else {
          return h.response('阅读已经记录过一次了')
        }
      } else {
        result = await createReadRecord()
      }

      return h.response(result).code(201)
    },
    config: {
      auth: false,
      tags: ['api', 'read'],
      description: '创建一条阅读记录',
      validate: {
        payload: {
          article_uid: Joi.string().guid().required()
        }
      }
    }
  }
]
module.exports = Routes
