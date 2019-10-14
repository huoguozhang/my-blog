const { uploader } = require('../utils/upload')
const routesArticle = require('./article')
const routesUser = require('./user')

const Routes = [
  {
    method: 'POST',
    path: '/api/upload',
    handler: async (request, h) => {
      // fs.writeFile('test.png',  request.payload.file.hapi, () => {},)
      const file = await uploader(request.payload.file)
      return h.response(file)
    },
    config: {
      auth: false,
      payload: {
        output: 'stream',
        allow: 'multipart/form-data' // important
      },
      tags: ['api', 'upload'],
      description: '文件上传'
    }
  },
  {
    method: 'GET',
    path: '/api/uploads/{fileName}',
    handler: (request, h) => {
      return h.file('./uploads/' + request.params.fileName)
    },
    config: {
      auth: false
    }
  }
]
module.exports = Routes.concat(routesUser, routesArticle)
