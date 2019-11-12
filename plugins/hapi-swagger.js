// plugins/hapi-swagger.js
const inert = require('@hapi/inert')
const vision = require('@hapi/vision')
const package = require('package')
const hapiSwagger = require('hapi-swagger')

module.exports = [
  inert,
  vision,
  {
    plugin: hapiSwagger,
    options: {
      documentationPath: '/docs',
      info: {
        title: 'my-blog 接口 文档',
        version: package.version
      },
      // 定义接口以 tags 属性定义为分组
      grouping: 'tags',
      tags: [
        { name: 'user', description: '用户接口' },
        { name: 'article', description: '文章接口' }
      ]
    }
  }
]
