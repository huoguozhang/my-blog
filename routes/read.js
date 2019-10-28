const Joi = require('@hapi/joi')
const models = require('../models')

const Routes = [
  {
    path: '/api/read/record',
    method: 'POST',
    handler: async (request, h) => {
      const info = request.info
      const ipReg = new RegExp(`^${info.received}\\:([^\\:]*)\\:`)
      const clientId = info.id.match(ipReg)[1]
      const articleUid = request.payload.article_uid
      const articleRead = await models.article_read.findAll({
        where: {
          article_uid: articleUid,
          client_id: clientId
        }
      })
      const readRecord = articleRead[0]
      function createReadRecord () {
        return models.article_read.create({
          client_id: clientId,
          received: info.received,
          request_id: info.id,
          article_uid: articleUid
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
      const readCount = await models.article_read.count({
        where: {
          article_uid: articleUid
        }
      })
      await models.article.update({
        read_num: readCount
      }, { where: { uid: articleUid } })
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
