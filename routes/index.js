const routesArticle = require('./article')
const routesUser = require('./user')
const Joi = require('@hapi/joi')

const Routes = [
  {
    method: 'POST',
    path: '/api/upload',
    handler: (request, h) => {
      request.payload['output'].pipe(fs.createWriteStream("test"))
    },
    config: {
      auth: false,
      tags: ['api', 'upload'],
      description: '文件上传',
      validate: {
        payload: {
          output: 'stream',
          allow: 'multipart/form-data' // important
        }
      }
    }
  }
]
 module.exports = Routes.concat(routesUser, routesArticle)
