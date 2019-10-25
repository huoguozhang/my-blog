const Joi = require('@hapi/joi')
const Op = require('sequelize').Op
const { paginationDefine, jwtHeaderDefine } = require('../utils/router-helper')
const models = require('../models')
const { extractTextFormMD } = require('../utils/stringHelp')
const { wrapDateQuery, wrapSearchQuery } = require('../utils/handleRouteQuery')
const Routes = [
  {
    path: '/api/article',
    method: 'POST',
    handler: async (request, h) => {
      const { userId } = request.auth.credentials
      const summary = extractTextFormMD(request.payload.content)
      const res = await models.article.create({ ...request.payload, summary, author: userId })
      return h.response(res).code(201)
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
      const { author, search, start_date, end_date } = request.query
      const whereObj = {}
      if (author) { whereObj.author = author }
      let matchUsers
      if (search && !author) {
        matchUsers = await models.user.findAll({
          where: {
            ...wrapSearchQuery(search, ['nickname', 'description'])
          }
        })
        whereObj.author = {
          [Op.or]: matchUsers.map(v => v.uid)
        }
      }
      const { rows: results, count: totalCount } = await models.article.findAndCountAll({
        include: [{
          model: models.user,
          attributes: {
            exclude: ['password']
          }
        }],
        attributes: [
          'updated_time',
          'created_time',
          'uid',
          'title',
          'summary',
          'author'
        ],
        where: {
          ...wrapDateQuery(start_date, end_date),
          ...wrapSearchQuery(search, [ 'title', 'content' ]),
          ...whereObj
        },
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit
      })
      // 开启分页的插件，返回的数据结构里，需要带上 result 与 totalCount 两个字段
      return h.response({ results, totalCount })
    },
    config: {
      auth: false,
      tags: ['api', 'article'],
      description: '获取文章列表',
      validate: {
        query: {
          search: Joi.string(),
          start_date: Joi.date(),
          end_date: Joi.date(),
          author: Joi.string(),
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
        include: [ {
          model: models.user,
          attributes: {
            exclude: [ 'password' ]
          }
        } ],
        where: {
          uid: request.params.uid
        }
      })
      return h.response(res[0])
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
      const successRes = { code: 0, message: '删除成功', data: null }
      const errorRes = { code: 9, message: `删除错误，uid:${uid}不存在`, data: null }
      return h.response(count > 0 ? successRes : errorRes)
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'article'],
      description: '删除一篇文章',
      validate: {
        ...jwtHeaderDefine,
        params: {
          uid: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/article/{uid}/',
    handler: async (request, h) => {
      const uid = request.params.uid
      const { title, content } = request.payload
      const data = await models.article.update(
        {
          title, content
        },
        {
          where: {
            uid
          }
        })
      const effectCount = data[0]
      const successRes = { code: 0, message: '修改成功', data: null }
      if (effectCount > 0) {
        const item = await models.article.findAll({
          where: { uid }
        })
        successRes.data = item[0]
      }
      const errorRes = { code: 7, message: `删除错误，uid:${uid}不存在`, data: null }
      return h.response(effectCount > 0 ? successRes : errorRes)
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'article'],
      description: '修改文章',
      validate: {
        ...jwtHeaderDefine,
        params: {
          uid: Joi.string().required()
        },
        payload: {
          title: Joi.string(),
          content: Joi.string()
        }
      }
    }
  }
]
module.exports = Routes
