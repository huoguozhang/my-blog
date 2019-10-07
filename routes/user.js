const Joi = require('@hapi/joi')
const models = require('../models')
const JWT = require('jsonwebtoken')
const { jwtHeaderDefine } = require('../utils/router-helper')

const generateJWT = (uid) => {
  const payload = {
    userId: uid,
    exp: Math.floor(new Date().getTime() / 1000) + 7 * 24 * 60 * 60,
  }
  return JWT.sign(payload, process.env.JWT_SECRET)
}

module.exports = [
  {
    method: 'GET',
    path: '/api/user',
    handler: async (request, h) => {
      const result = await models.user.findAll({
        attributes: {
          exclude: ['password']
        }
      })
      return h.response(result)
    },
    config: {
      auth: 'jwt',
      tags: ['api', 'user'],
      description: '用户',
      validate: {
        ...jwtHeaderDefine
      }
    }
  },
  {
    method: 'POST',
    path: '/api/user',
    handler: async (request, h) => {
      const res = await models.user.create(request.payload)
      return h.response('created').code(201)
    },
    config: {
      tags: ['api', 'user'],
      description: '增加用户',
      validate: {
        payload: {
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/user/login',
    handler: async (request, h) => {
      let res = await models.user.findAll({
        attributes: {
          exclude: ['password', 'created_time', 'updated_time']
        },
        where: {
          username: request.payload.username,
          password: request.payload.password
        }
      })
      let data = res[0]
      if (res.length > 0) {
        return h.response({
          code: 0,
          message: '成功',
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
    method: ['GET', 'PUT', 'PATCH', 'DELETE'],
    path: '/api/user/{uid}',
    handler: (request, reply) => {
      return ('hello hapi')
    },
    config: {
      tags: ['api', 'user'],
      description: '用户',
      validate: {
        params: {
          uid: Joi.string().required()
        }
      }
    }
  }
]
