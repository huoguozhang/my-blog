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
      auth: false, // 'jwt',
      tags: ['api', 'article'],
      description: '创建文章',
      validate: {
        // ...jwtHeaderDefine,
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
    method: 'GET',
    path: '/api/article/{uid}/',
    handler: async (request, h) => {
      const res = await models.article.findAll({
        where: {
          uid: request.params.uid
        }
      })
      return h.response(res)
    },
    config: {
      auth: false,
      tags: ['api', 'article'],
      description: '获取某一篇文章',
      validate: {
        params: {
          uid: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/article/{uid}/',
    handler: async (request, h) => {
      const uid = request.params.uid
      const count = await models.article.destroy({
        where: {
          uid
        }
      })
      let successRes = { code: 0, message: '删除成功', data: null }
      let errorRes = { code: 9, message: `删除错误，uid:${uid}不存在`, data: null }
      return h.response(count > 0 ? successRes : errorRes)
    },
    config: {
      auth: false,
      tags: ['api', 'article'],
      description: '删除一篇文章',
      validate: {
        params: {
          uid: Joi.string().required()
        }
      }
    }
  }
]
module.exports = Routes
