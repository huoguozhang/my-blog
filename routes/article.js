const Joi = require('@hapi/joi')
const Sequelize = require('sequelize')
const { paginationDefine, jwtHeaderDefine } = require('../utils/router-helper')
const models = require('../models')
const { wrapDateQuery, wrapSearchQuery } = require('../utils/handleRouteQuery')
const Op = Sequelize.Op

const Routes = [
  {
    path: '/api/article',
    method: 'POST',
    handler: async (request, h) => {
      const { userId } = request.auth.credentials
      const res = await models.article.create({ ...request.payload, author: userId })
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
          content: Joi.string().required(),
          word_count: Joi.number().integer().required(),
          summary: Joi.string().required(),
          cover: Joi.string()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/article',
    handler: async (request, h) => {
      const { author, search, start_date, end_date, is_rand, is_latest } = request.query
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
      const countObj = {
        where: {
          ...wrapDateQuery(start_date, end_date),
          ...wrapSearchQuery(search, [ 'title', 'content' ]),
          ...whereObj
        }
      }
      const findObj = {
        include: [
          {
            model: models.user,
            attributes: {
              exclude: [ 'password' ]
            }
          },
          {
            model: models.comment,
            attributes: ['uid']
          },
          {
            model: models.article_like,
            attributes: ['uid', 'like_status']
          }
        ],
        attributes: {
          exclude: ['content']
        },
        ...countObj,
        limit: request.query.limit,
        offset: (request.query.page - 1) * request.query.limit
      }
      if (is_latest) {
        findObj.order = [['updated_time', 'DESC']]
      }
      if (is_rand && !is_latest) {
        findObj.order = Sequelize.fn('RAND')
      }
      const totalCount = await models.article.count(countObj)
      const results = await models.article.findAll(findObj)
      results.forEach((row) => {
        const data = row.dataValues
        data.comment_count = data.comments.length
        data.like_count = data.article_likes.filter(v => v.like_status === 1).length
        delete data.comments
        delete data.article_likes
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
          is_latest: Joi.boolean().default(true),
          is_rand: Joi.boolean().default(false),
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
      const articleUid = request.params.uid
      /* const likeCount = await models.article_like.count({
        where: {
          article_uid: articleUid
        }
      }) */
      const res = await models.article.findAll({
        include: [
          {
            model: models.user,
            attributes: {
              exclude: ['password']
            }
          },
          {
            model: models.article_like,
            attributes: ['uid', 'like_status']
          }
        ],
        where: {
          uid: articleUid
        }
      })
      let result = res[0]
      result.dataValues.like_count = result.dataValues.article_likes.filter(v => v.like_status === 1).length
      delete result.dataValues.article_likes
      return h.response(result)
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
    handler: (request) => {
      const uid = request.params.uid
      const successRes = { code: 0, message: '删除成功', data: null }
      const errorRes = { code: 9, message: `删除错误，uid:${uid}不存在`, data: null }
      // 这里用事务处理-删除文章-应该把关联信息也删掉-评论-阅读信息-喜欢信息
      return models.sequelize.transaction((t) => {
        return models.article.destroy({
          where: {
            uid
          }
        }, { transaction: t })
          .then((count) => {
            if (count === 0) { throw new Error('文章未找到!') }
            return Promise.all([
              models.comment.destroy({ where: { article_uid: uid } }, { transaction: t }),
              models.article_like.destroy({ where: { article_uid: uid } }, { transaction: t }),
              models.article_read.destroy({ where: { article_uid: uid } }, { transaction: t })
            ])
          })
      })
        .then(() => {
          // 事务已经被提交
          return successRes
        })
        .catch(() => {
          // 事务被回滚
          return errorRes
        })
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
      const { userId } = request.auth.credentials
      const data = await models.article.update(
        {
          ...request.payload
        },
        {
          where: {
            uid, author: userId
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
      const errorRes = { code: 7, message: `修改错误`, data: null }
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
          content: Joi.string(),
          word_count: Joi.number().integer(),
          summary: Joi.string(),
          cover: Joi.string()
        }
      }
    }
  }
]
module.exports = Routes
