module.exports = [
  {
    method: ['GET', 'POST'],
    path: '/user',
    handler: (request, reply) => {
      return ('hello hapi')
    },
    config: {
      tags: ['api', 'user'],
      description: '用户'
    }
  },
  {
    method: ['GET', 'PUT', 'PATCH', 'DELETE'],
    path: '/user/{uid}',
    handler: (request, reply) => {
      return ('hello hapi')
    },
    config: {
      tags: ['api', 'user'],
      description: '用户'
    }
  }
]
