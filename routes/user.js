const Joi = require('@hapi/joi')
const models = require('../models')
module.exports = [
  {
    method: 'GET',
    path: '/api/user',
    handler: async (request, h) => {
      const result = await models.user.findAll()
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
    handler: (request, reply) => {
      return ('hello hapi')
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
