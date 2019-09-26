const consola = require('consola')
const Hapi = require('@hapi/hapi')
const HapiNuxt = require('@nuxtjs/hapi')
const routesArticle = require('../routes/article')
const routesUser = require('../routes/user')
// 引入自定义的 hapi-swagger 插件配置
const pluginHapiSwagger = require('../plugins/hapi-swagger')
const pluginHapiPagination = require('../plugins/hapi-pagination')
async function start () {
  const server = new Hapi.Server({
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3000
  })

  /* await server.register({
    plugin: HapiNuxt,
    options: {}
  }) */
  // 日志
  /*await server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: false,
      logEvents: ['response', 'onPostStart']
    }
  })*/
  await server.register([
    // 为系统使用 hapi-swagger
    ...pluginHapiSwagger
    ]
  )
  await server.register([
    pluginHapiPagination
  ])

  server.route(
    // 创建一个简单的hello hapi接口
    [...routesArticle, ...routesUser]
  )

  await server.start()

  consola.ready({
    message: `Server running at: ${server.info.uri}`,
    badge: true
  })
}

process.on('unhandledRejection', error => consola.error(error))

start()
