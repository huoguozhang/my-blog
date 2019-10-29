const Sequelize = require('sequelize')
const Joi = require('@hapi/joi')
const JWT = require('jsonwebtoken')
const { wrapSearchQuery } = require('../utils/handleRouteQuery')
const models = require('../models')
const { jwtHeaderDefine } = require('../utils/router-helper')
const Op = Sequelize.Op

const generateJWT = (uid) => {
  const payload = {
    userId: uid,
    exp: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60
  }
  return JWT.sign(payload, process.env.JWT_SECRET)
}

async function queryUserTotalLikeWordArticle (userUid, res) {
  let result = res
  const [wordAndArticleCount] = await models.sequelize.query(`
      select SUM(word_count) total_word_count, COUNT(*) article_count from article WHERE author='${userUid}';
      `, { type: Sequelize.QueryTypes.SELECT})
  const [likeCount] = await models.sequelize.query(`
      select count(*) total_like_count from article_like A
       left join article B on A.\`article_uid\`=B.uid where A.like_status=1 and B.author='${userUid}';
       `, { type: Sequelize.QueryTypes.SELECT})
  result = result.map(row => ({ ...row.dataValues, ...wordAndArticleCount, ...likeCount}))
  return result
}

module.exports = [
  {
    method: 'GET',
    path: '/api/user/current',
    handler: async (request, h) => {
      const { userId } = request.auth.credentials
      const result = await models.user.findAll({
        where: {
          uid: userId
        },
        attributes: {
          exclude: ['password']
        }
      })

      return h.response(result[0])
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'user'],
      description: '当前登录用户的信息',
      validate: {
        ...jwtHeaderDefine
      }
    }
  },
  {
    method: 'GET',
    path: '/api/user',
    handler: async (request, h) => {
      const { search } = request.query
      const res = await models.user.findAll({
        attributes: {
          exclude: ['password']
        },
        where: {
          ...wrapSearchQuery(search, ['nickname', 'description'])
        }
      })
      return h.response(res)
    },
    config: {
      auth: false,
      tags: ['api', 'user'],
      description: '用户列表',
      validate: {
        query: {
          search: Joi.string()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/user',
    handler: async (request, h) => {
      const nickname = request.payload.nickname
      const username = request.payload.username
      const exist = await models.user.findAll({
        where: {
          [Op.or]: [{ nickname }, { username }]
        }
      })

      let message = ''

      const conflic = exist.some((v) => {
        if (v.nickname === nickname) {
          message = '昵称已经存在'
          return true
        }
        if (v.username === username) {
          message = '用户名已经存在'
          return true
        }
        return false
      })
      if (conflic) {
        return h.response({
          code: 8,
          message,
          data: null
        })
      }
      const res = await models.user.create(request.payload)
      return h.response({ code: 0, message: '注册成功!', data: res }).code(201)
    },
    config: {
      auth: false,
      tags: ['api', 'user'],
      description: '增加用户',
      validate: {
        payload: {
          username: Joi.string().required(),
          password: Joi.string().required(),
          nickname: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/user/login',
    handler: async (request, h) => {
      const res = await models.user.findAll({
        attributes: {
          exclude: ['password', 'created_time', 'updated_time']
        },
        where: {
          username: request.payload.username,
          password: request.payload.password
        }
      })
      const data = res[0]
      if (res.length > 0) {
        return h.response({
          code: 0,
          message: '登录成功!',
          data: {
            token: generateJWT(data.uid),
            ...data.dataValues
          }
        })
      } else {
        return h.response({
          code: 10,
          message: '用户名或密码错误'
        })
      }
    },
    config: {
      auth: false,
      tags: ['api', 'user'],
      description: '用户登录',
      validate: {
        payload: {
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/api/user/{uid}',
    handler: async (request, h) => {
      const userUid = request.params.uid
      const res = await models.user.findAll({
        where: {
          uid: userUid
        },
        attributes: {
          exclude: ['password']
        }
      })
      let result = await queryUserTotalLikeWordArticle(userUid, res)
      return h.response(result[0])
    },
    config: {
      auth: false,
      tags: ['api', 'user'],
      description: '获取用户信息',
      validate: {
        params: {
          uid: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/user/{uid}',
    handler: async (request, h) => {
      const { uid } = request.params
      const { userId } = request.auth.credentials
      if (uid !== userId) {
        return h.response({ code: 3, message: '没有权限', data: null })
      }
      const count = await models.user.update(request.payload, { where: { uid } })
      const successRes = { code: 0, message: '修改成功', data: null }
      const errorRes = { code: 9, message: `修改错误，uid:${uid}不存在`, data: null }
      return h.response(count > 0 ? successRes : errorRes)
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'user'],
      description: '修改用户信息',
      validate: {
        ...jwtHeaderDefine,
        params: {
          uid: Joi.string().required()
        },
        payload: {
          description: Joi.string(),
          password: Joi.string(),
          nickname: Joi.string(),
          avatar: Joi.string()
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/user/{uid}',
    handler: async (request, h) => {
      const { uid } = request.params
      const count = await models.user.destroy({ where: { uid } })
      const successRes = { code: 0, message: '删除成功', data: null }
      const errorRes = { code: 9, message: `删除错误，uid:${uid}不存在`, data: null }
      return h.response(count > 0 ? successRes : errorRes)
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'user'],
      description: '删除用户',
      validate: {
        ...jwtHeaderDefine,
        params: {
          uid: Joi.string().required()
        }
      }
    }
  }
]
