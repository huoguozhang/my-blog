const Routes = [
  {
    method: ['GET', 'POST'],
    path: '/api/article',
    handler (request, h) {
      return 'hello'
    },
    config: {
      tags: ['api', 'article'],
      description: '文章接口'
    }
  },
  {
    method: ['PUT', 'DELETE', 'PATCH', 'GET'],
    path: '/api/article/{uid}/',
    handler (req, h) {
      return 'hello' + req.params.uid
    },
    config: {
      tags: ['api', 'article'],
      description: '文章'
    }
  }
]
module.exports = Routes
