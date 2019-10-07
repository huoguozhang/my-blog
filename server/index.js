const consola = require('consola')
const Hapi = require('@hapi/hapi')
const HapiNuxt = require('@nuxtjs/hapi')
const routesArticle = require('../routes/article')
const routesUser = require('../routes/user')
// 引入自定义的 hapi-swagger 插件配置
const pluginHapiSwagger = require('../plugins/hapi-swagger')
const pluginHapiPagination = require('../plugins/hapi-pagination')
// auth
const hapiAuthJWT2 = require('hapi-auth-jwt2')
const pluginHapiAuthJWT2 = require('../plugins/hapi-auth-jwt2')

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
  // 分页
  await server.register([
    pluginHapiPagination
  ])
  // 鉴权
  await server.register(hapiAuthJWT2)

  pluginHapiAuthJWT2(server)

  server.route(
    // 创建路由
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
