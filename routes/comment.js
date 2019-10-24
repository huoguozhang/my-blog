const Joi = require('@hapi/joi')
const models = require('../models')
const { jwtHeaderDefine } = require('../utils/router-helper')

const Routes = [
  {
    path: '/api/comment',
    method: 'POST',
    handler: async (request, h) => {
      const { userId } = request.auth.credentials
      const res = await models.article.create({
        content: request.payload.content,
        author: userId,
        article_uid: request.payload.article_uid
      })
      return h.response(res).code(201)
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'comment'],
      description: '创建一条评论',
      validate: {
        ...jwtHeaderDefine,
        payload: {
          content: Joi.string().required(),
          author: Joi.string().guid().required(),
          article_uid: Joi.string().guid().required()
        }
      }
    }
  }
]
module.exports = Routes
