const consola = require('consola')
const Hapi = require('@hapi/hapi')
const HapiNuxt = require('@nuxtjs/hapi')
const Inert = require('inert')
// auth
const hapiAuthJWT2 = require('hapi-auth-jwt2')

const routes = require('../routes')
// 引入自定义的 hapi-swagger 插件配置
const pluginHapiSwagger = require('../plugins/hapi-swagger')
const pluginHapiPagination = require('../plugins/hapi-pagination')
const pluginHapiAuthJWT2 = require('../plugins/hapi-auth-jwt2')

async function start () {
  const server = new Hapi.Server({
    // host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3000
  })

  /*await server.register({
    plugin: HapiNuxt,
    options: {}
  })*/

  // 日志
  /*await server.register({
    plugin: require('hapi-pino'),
    options: {
      prettyPrint: true,
      // logPayload: true,
      logEvents: ['response', 'onPostStart']
    }
  })*/
  await server.register(Inert)

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
    routes
  )

  // 请求生命周期-在路由handler之后再包装一下response 返回的结果为 { code: number, message: string, data: any }
  server.ext('onPostHandler', function (request, h) {
    const routeResponse = request.response.source
    if (!/^\/api/.test(request.path) || (routeResponse.hasOwnProperty('path') && routeResponse.hasOwnProperty('file'))) {
      // 非api开头的接口不在处理范围内 或者接口返回h.file()
      return h.response(request.response)
    }
    const useOriginResponse = routeResponse.hasOwnProperty('code')
    const result = useOriginResponse ? routeResponse : { code: 0, message: '成功', data: routeResponse }
    return h.response(result)
  })

  await server.start()

  consola.ready({
    message: `Server running at: ${server.info.uri}`,
    badge: true
  })
}

process.on('unhandledRejection', error => consola.error(error))

start()
