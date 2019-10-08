const Joi = require('@hapi/joi')
const { paginationDefine, jwtHeaderDefine } = require('../utils/router-helper')
const models = require('../models')

const Routes = [
  {
    path: '/api/article',
    method: 'POST',
    handler: async (request, h) => {
      const res = await models.article.create(request.payload)
      return h.response('created').code(201)
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'article'],
      description: '创建文章',
      validate: {
        ...jwtHeaderDefine,
        payload: {
          title: Joi.string().required(),
          content: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/article',
    handler: async (request, h) => {
      const {rows: results, count: totalCount} = await models.article.findAndCountAll({
        attributes: [
          'uid',
          'title',
          'content'
        ],
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit,
      });
      // 开启分页的插件，返回的数据结构里，需要带上 result 与 totalCount 两个字段
      return h.response({results, totalCount})
    },
    config: {
      auth: false,
      tags: ['api', 'article'],
      description: '获取文章列表',
      validate: {
        query: {
          ...paginationDefine
        }
      }
    }
  },
  {
    method: ['PUT', 'DELETE', 'PATCH', 'GET'],
    path: '/api/article/{uid}/',
    handler (request, h) {
      return 'hello'
    },
    config: {
      tags: ['api', 'article'],
      description: '文章'
    }
  }
]
module.exports = Routes
