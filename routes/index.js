const routesArticle = require('./article')
const routesUser = require('./user')
const Joi = require('@hapi/joi')

const Routes = [
  {
    method: 'POST',
    path: '/api/upload',
    handler: () => {},
    config: {
      auth: false,
      tags: ['api', 'upload'],
      description: '文件上传',
      validate: {
        payload: {
          file: Joi
        }
      }
    }
  }
]
 module.exports = Routes.concat(routesUser, routesArticle)
