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
      auth: false, //'jwt',
      tags: ['api', 'user'],
      description: '用户',
      validate: {
        // ...jwtHeaderDefine
      }
    }
  },
  {
    method: 'POST',
    path: '/api/user',
    handler: async (request, h) => {
      const res = await models.user.create(request.payload)
      return h.response({ code: 0, message: '注册成功!', data: res }).code(201)
    },
    config: {
      tags: ['api', 'user'],
      description: '增加用户',
      validate: {
        payload: {
          username: Joi.string().required(),
          password: Joi.string().required(),
          nickname: Joi.string()
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
      const res = await models.user.findAll({
        where: {
          uid: request.params.uid
        },
        exclude: ['password']
      })
      return h.response(res[0])
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
      const { uid }= request.payload
      const count = await models.user.update(request.payload, { where: { uid } })
      let successRes = { code: 0, message: '修改成功', data: null }
      let errorRes = { code: 9, message: `修改错误，uid:${uid}不存在`, data: null }
      return h.response(count > 0 ? successRes : errorRes)
    },
    config: {
      auth: false,
      tags: ['api', 'user'],
      description: '修改用户信息',
      validate: {
        params: {
          uid: Joi.string().required()
        },
        payload: {
          username: Joi.string(),
          password: Joi.string(),
          nickname: Joi.string()
        }
      }
    }
  }
]
