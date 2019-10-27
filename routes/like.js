const Joi = require('@hapi/joi')
const models = require('../models')
const { jwtHeaderDefine } = require('../utils/router-helper')

const Routes = [
  {
    path: '/api/like',
    method: 'POST',
    handler: async (request, h) => {
      const res = await models.article_like.create({
        like_status: request.payload.like_status,
        author: userId,
        article_uid: request.payload.article_uid
      })
      return h.response(res).code(201)
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'like'],
      description: '创建一条喜欢记录',
      validate: {
        ...jwtHeaderDefine,
        payload: {
          like_status: Joi.number().integer().min(0).max(2).required(),
          article_uid: Joi.string().guid().required()
        }
      }
    }
  },
  {
    path: '/api/like/{uid}',
    method: 'PUT',
    handler: async (request, h) => {
      const res = await models.article_like.update({ like_status: request.payload.like_status }, { where: { uid: request.params.uid } })
      return h.response(res)
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'like'],
      description: '修改一条喜欢记录',
      validate: {
        ...jwtHeaderDefine,
        params: {
          uid: Joi.string().guid()
        },
        payload: {
          like_status: Joi.number().integer().min(0).max(2).required()
        }
      }
    }
  },
  {
    path: '/api/like/current',
    method: 'GET',
    handler: async (request, h) => {
      const { userId } = request.auth.credentials
      const res = await models.article_like.findAll({
        include: [{
          model: models.user,
          attributes: {
            exclude: ['password']
          }
        }],
        where: {
          article_uid: request.query.article_uid,
          author: userId
        }
      })
      let result = res[0] || {}
      return h.response(result)
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'like'],
      description: '获取当前用户是否喜欢某一片文章',
      validate: {
        ...jwtHeaderDefine,
        query: {
          article_uid: Joi.string().guid().required()
        }
      }
    }
  }
]
module.exports = Routes
