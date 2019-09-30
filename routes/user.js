const Joi = require('@hapi/joi')
const models = require('../models')
const JWT = require('jsonwebtoken')

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
      return result
    },
    config: {
      tags: ['api', 'user'],
      description: '用户'
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
    handler: (request, reply) => {
      return ('hello hapi')
    },
    config: {
      tags: ['api', 'user'],
      description: '用户登录',
      validate: {
        payload: {
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      },
      handler: async (request, h) => {
        let res = await models.user.findAll({
          where: {
            username: request.payload.username,
            password: request.payload.password
          }
        })
        console.log(res)
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
