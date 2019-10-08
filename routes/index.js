const routesArticle = require('./article')
const routesUser = require('./user')
const Joi = require('@hapi/joi')

const Routes = [
  {
    method: 'POST',
    path: '/api/upload',
    handler: (request, h) => {
      console.log('upload')
      console.log(request.payload)
      return h.response(request.payload)
    },
    config: {
      auth: false,
      tags: ['api', 'upload'],
      description: '文件上传',
      validate: {
        payload: {
          filefield: Joi.object(),
          output: 'file'
        }
      }
    }
  }
]
 module.exports = Routes.concat(routesUser, routesArticle)
