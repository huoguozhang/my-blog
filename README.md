# 前言:
#### 预览：

-  **本站预览:** [腾讯云ip](http://118.24.115.89)、域名[zhanglijian.top](zhanglijian.top)
-  **github**:[https://github.com/huoguozhang/my-blog](https://github.com/huoguozhang/my-blog)

#### 开始：
1. npm i
2. 把mysql配置好
3. npm run server or npm run dev

#### 实现功能：
-  用户: 登录、注册、用户资料修改，详情页面，类似于简书的文章数量、总字数、收获的喜欢总数，文章删除。

![用户页面.jpg](https://upload-images.jianshu.io/upload_images/6036420-e48a23b57b3b4692?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
-  文章：文章详情页面，查看，评论，点赞和踩，文章阅读次数统计

![文章详情.jpg](https://upload-images.jianshu.io/upload_images/6036420-15f16a93f8ff14ca?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
-  文章： 所有文章，支持分页和按关键词、时间查找
![所有文章.jpg](https://upload-images.jianshu.io/upload_images/6036420-364e463a81b62ff2?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
-  文章书写：支持markdown和图片拖拽上传

![image](https://upload-images.jianshu.io/upload_images/6036420-75ca7d753e6544db?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
-  首页:  文章推荐，作者推荐，首页轮播，顶部搜索文章和用户
![首页.jpg](https://upload-images.jianshu.io/upload_images/6036420-8ff57f2d6da1da16?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

-  ssr  效果预览：
类似于知乎的
![ssr.jpg](https://upload-images.jianshu.io/upload_images/6036420-36e48e517c74edd8?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
- seo 效果：
待补充

# 1 技术栈：
-   前端：axios、element-ui、nuxt.js、 ts
-   后端：node.js、hapi.js、sequelize(orm)、 hapi-auth(token)、 hapi-swagger(在线api文档)、hapi-pagination(分页)、joi(前端请求数据检验类似于element的表单校验)、 mysql 和其他插件 

#  2 技术细节介绍：
**说明:** 本文主要侧重后端，最后的效果类似于我司后端
#### 目录结构：
```
├── assets // 静态资源，css, 图片等
├── client // 客户端目录，axios请求函数和其他辅助函数
├── components // vue组件目录
├── config // 默认设置
├── layouts // nuxt视图
├── middleware // nuxt 中间件
├── migrations // orm 数据迁移
├── models // orm 数据模型 
├── nuxt.config.js 
├── nuxt.config.ts
├── package-lock.json
├── package.json
├── pages // nuxt
├── plugins // hapi插件和nuxt插件
├── routes // hapi路由
├── seeders // 种子数据
├── server // app.js
├── static // 静态资源
├── store // nuxt
├── tsconfig.json 
├── uploads // 文件上传目标目录
└── utils // 辅助函数

```
#### 前言:为什么是hapi.js ?
hapi[官方文档](https://hapi.dev/tutorials/?lang=en_US)已经说了很多了([expresstohapi](https://hapi.dev/tutorials/expresstohapi/?lang=zh_CN)),这里最吸引我的是，不用安装很多的插件(expres的话有很多的xx-parse插件...)，就能满足我的需求，而且hapi已经应用于商用了。
#### 注意点:
 我的这些代码，在我目前的package.json的版本是能正常运行的，hapi版本大版本有时候会出现不兼容的，不同版本的hapi对应着不同的插件版本，所以需要和我的版本保持一致，我还遇到过nuxt.js v2.9运行加入ts出现不识别@component的情况，安装2.8.x版本就没有问题。
## 2.1 Sequelize建模
开发后台第一个想到的是建立数据模型(建表)，默认你已经安装好了mysql
之前我自己用数据库，不知道有orm这个工具的时候，会选择自己用navicat这样的图形化工具建表或者直接用sql语句建表。这样做有几个缺点:
1. 对数据库的操作记录不明确，我新建一个表或者新增字段，我后悔了，删掉，我又后悔了，orm的数据迁移就可以用来做这些事情类似于git。
2. 迁移新环境,用sql操作很麻烦,直接执行orm的命令自动建表。
3. 数据模型,之前后台程序与mysql联系的时候，仅仅在建立了连接池，数据的关系，表结构这些我们其实并不知道。
4. 执行增删改查代码更简洁清晰
5. 其他

**注意**：用orm在执行sql操作时，相当于我们用jquery执行dom操作，api简单了，但还是需要对原来的有点了解
### sequelize
[sequelize](https://sequelize.org/master/index.html)就是node.js的promise orm工具,同时也支持其他数据库.
#### 使用
1. 安装插件:
```
npm i sequelize-cli -D
npm i sequelize
npm i mysql2
```
2. sequelize init
通过 sequelize-cli 初始化 sequelize，我们将得到一个好用的初始化结构：
```
// 可以安装npx
node_modules/.bin/sequelize init
```
```
├── config                       # 项目配置目录
|   ├── config.json              # 数据库连接的配置
├── models                       # 数据库 model
|   ├── index.js                 # 数据库连接的样板代码
├── migrations                   # 数据迁移的目录
├── seeders                      # 数据填充的目录
```
**config/config.json**

默认生成文件为一个 config.json 文件，文件里配置了开发、测试、生产三个默认的样板环境，我们可以按需再增加更多的环境配置。这里我用config.js替代config.json，这样配置更加灵活
修改后的 config/config.js 如下，仅预留了 development（开发） 与 production（生产） 两个环境，开发环境与生产环境的配置参数可以分离在 .env 和 .env.prod 两个不同的文件里，通过环境变量参数 process.env.NODE_ENV 来动态区分。
```
// config.js
if (process.env.NODE_ENV === 'production') {
  require('env2')('./.env.prod')
} else {
  require('env2')('./.env.dev')
}

const { env } = process
module.exports = {
  'development': {
    'username': env.MYSQL_USERNAME,
    'password': env.MYSQL_PASSWORD,
    'database': env.MYSQL_DB_NAME,
    'host': env.MYSQL_HOST,
    'port': env.MYSQL_PORT,
    dialect: 'mysql',
    logging: false, // mysql 执行日志
    timezone: '+08:00'
    // "operatorsAliases": false,  // 此参数为自行追加，解决高版本 sequelize 连接警告
  },
  'production': {
    'username': env.MYSQL_USERNAME,
    'password': env.MYSQL_PASSWORD,
    'database': env.MYSQL_DB_NAME,
    'host': env.MYSQL_HOST,
    'port': env.MYSQL_PORT,
    dialect: 'mysql',
    timezone: '+08:00'
    // "operatorsAliases": false, // 此参数为自行追加，解决高版本 sequelize 连接警告
  }
}

```
**.env.dev**
```
# 服务的启动名字和端口，但也可以缺省不填值，默认值的填写只是一定程度减少起始数据配置工作
HOST = 127.0.0.1
PORT = 80
#  端口最好就为80，不然axios url要改为绝对地址
# MySQL 数据库链接配置
MYSQL_HOST = 111.111.111.111
MYSQL_PORT = 3306
MYSQL_DB_NAME = 数据库名
MYSQL_USERNAME = 数据库用户名
MYSQL_PASSWORD = 数据库密码
JWT_SECRET = token密钥

```
3. 创建数据库
```
npx sequelize db:create
```
4. 创建迁移文件
```
npx migration:create --name user
```
在 migrations 的目录中，会新增出一个 时间戳-user.js 的迁移文件，自动生成的文件里，包涵有 up 与 down 两个空函数， up 用于定义表结构正向改变的细节，down 则用于定义表结构的回退逻辑。比如 up 中有 createTable 的建表行为，则 down 中配套有一个对应的 dropTable 删除表行为。相当于是一条操作记录记录。修改后的用户迁移文件如下:
```
'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'user',
    {
      uid: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      avatar: Sequelize.STRING,
      description: Sequelize.STRING,
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_time: Sequelize.DATE,
      updated_time: Sequelize.DATE
    },
    {
      charset: 'utf8'
    }
  ),

  down: queryInterface => queryInterface.dropTable('user')
}
```

5. 执行迁移

```
npx sequelize db:migrate
```
sequelize db:migrate 的命令，可以最终帮助我们将 migrations 目录下的迁移行为定义，按时间戳的顺序，逐个地执行迁移描述，最终完成数据库表结构的自动化创建。并且，在数据库中会默认创建一个名为 SequelizeMeta 的表，用于记录在当前数据库上所运行的迁移历史版本。已经执行过的不会再次执行，可以执行sequelize db:migrate:undo执行上个迁移文件的down命令。

6. 种子数据

执行
```
sequelize seed:create --name init-user
```
类似的在seeders目录下生成一份文件 时间戳-init-user.js
修改后
```
'use strict'
const uuid = require('uuid')
const timeStamp = {
  created_time: new Date(),
  updated_time: new Date()
}
const users = []
for (let i = 1; i < 5; i++) {
  users.push(
    {
      uid: uuid(), username: 'zlj' + i, password: '123', nickname: '火锅' + 1, ...timeStamp
    }
  )
}
module.exports = {
  up: queryInterface => queryInterface.bulkInsert('user', users, { charset: 'utf-8' }),
  down: (queryInterface, Sequelize) => {
    const { Op } = Sequelize
    return queryInterface.bulkDelete('user', { uid: { [Op.in]: users.map(v => v.uid) } }, {})
  }
}


```
执行填充命令
```
sequelize db:seed:all
```
查看数据库user表就多了一些记录，其他的操作类似于迁移，更多的操作可以看文档
7 定义模型
 user表 models/user.js
```
const moment = require('moment')
module.exports = (sequelize, DataTypes) => sequelize.define(
  'user',
  {
    uid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    avatar: DataTypes.STRING,
    description: DataTypes.STRING,
    nickname: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_time: {
      type: DataTypes.DATE,
      get () {
        return moment(this.getDataValue('created_time')).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    updated_time: {
      type: DataTypes.DATE,
      get () {
        return moment(this.getDataValue('updated_time')).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  {
    tableName: 'user'
  }
)

```

8. 实例化seqlize
modes/index.js
```
'use strict'
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const Sequelize = require('sequelize')
const basename = path.basename(__filename) // eslint-disable-line
const configs = require(path.join(__dirname, '../config/config.js'))
const db = {}
const env = process.env.NODE_ENV || 'development'
const config = {
  ...configs[env],
  define: {
    underscored: true,
    timestamps: true,
    updatedAt: 'updated_time',
    createdAt: 'created_time',
    hooks: {
      beforeCreate (model) {
        model.uid = uuid()
      }
    }
  }
}
let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}
fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
  })
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})
db.sequelize = sequelize
db.Sequelize = Sequelize
// 外键关联关系
// 假设你所有表建立好了
db.user.hasMany(db.article, { foreignKey: 'uid' })
db.article.belongsTo(db.user, { foreignKey: 'author' })
db.user.hasMany(db.comment, { foreignKey: 'uid' })
db.comment.belongsTo(db.user, { foreignKey: 'author' })
db.user.hasMany(db.article_like, { foreignKey: 'uid' })
db.article_like.belongsTo(db.user, { foreignKey: 'author' })
db.article.hasMany(db.comment)
db.comment.belongsTo(db.article)
db.article.hasMany(db.article_like)
db.article_like.belongsTo(db.article)
module.exports = db
```
9. 本项目用到的功能

   多表查询、单表增删改查、模型统一配置、迁移和种子填充、事务（删除文章的时候，把文章相关的数据：评论，阅读，点赞数据也一起删了。）等。

## 2.2 Joi 请求参数校验

joi可以对请求参数进行校验
#### 使用：
1. 安装
```
# 安装适配 hapi v16 的 joi 插件
npm i joi@14
```
2. 使用见2.3 config.validate，更多参考官方文档

## 2.3 用hapi 写接口

**post: 登录接口:**
routes/user.js
```
const models = require('../models')
const Joi = require('@hapi/joi')
{
    method: 'POST',
    path: '/api/user/login',
    handler: async (request, h) => {
      const res = await models.user.findAll({
        attributes: {
          exclude: ['password', 'created_time', 'updated_time']
        },
        where: {
          username: request.payload.username,
          // 一般密码存库都会加密的，md5等
          password: request.payload.password
        }
      })
      const data = res[0]
      if (res.length > 0) {
        return h.response({
          code: 0,
          message: '登录成功!',
          data: {
            // 写入token
            token: generateJWT(data.uid),
            ...data.dataValues
          }
        })
      } else {
        return h.response({
          code: 10,
          message: '用户名或密码错误'
        })
      }
    },
    config: {
      auth: false,
      tags: ['api', 'user'],
      description: '用户登录',
      validate: {
        payload: {
          username: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    }
  },

```
## 2.4 接口文档swagger

1. 安装:
```
npm i hapi-swagger@10
npm i inert@5
npm i vision@5
npm i package@1
```
2. 使用
```
├── plugins                       # hapi 插件配置
|   ├── hapi-swagger.js  
```
hapi-swagger.js
```
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
```

 server/index.js
```
const pluginHapiSwagger = require('../plugins/hapi-swagger')
// 注册插件
...
 await server.register([
    // 为系统使用 hapi-swagger
    ...pluginHapiSwagger
  ]
...
```

 打开你的dev.host:dev.port/docs
 可以查看[我线上的](http://118.24.115.89/docs)

## 2.5 token认证hapi-auth-jwt2
cookie hapi已经帮你解析好了，文件上传也是
1. 安装:
npm i hapi-auth-jwt2@8
2. 配置:
[文档](https://www.npmjs.com/package/hapi-auth-jwt2)
```
├── plugins                       # hapi 插件配置
│ ├── hapi-auth-jwt2.js           # jwt 配置插件
```
hapi-auth-jwt2.js
```
const validate = (decoded) => {
  // eslint disable
  // decoded 为 JWT payload 被解码后的数据
  const { exp } = decoded
  if (new Date(exp * 1000) < new Date()) {
    const response = {
      code: 4,
      message: '登录过期',
      data: '登录过期'
    }
    return { isValid: true, response }
  }
  return { isValid: true }
}
module.exports = (server) => {
  server.auth.strategy('jwt', 'jwt', {
    // 需要自行在 config/index.js 中添加 jwtSecret 的配置，并且通过 process.env.JWT_SECRET 来进行 .git 版本库外的管理。
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: {
      ignoreExpiration: true
    }
  })
  server.auth.default('jwt')
}
```

3. 注册插件
server/index.js
```
const hapiAuthJWT2 = require('hapi-auth-jwt2')
...
await server.register(hapiAuthJWT2)
...
```
4. 效果:
默认情况下所有的接口都需要token认证的
可以将某个接口(比如登录接口)config.auth = false不开启
回到上面的登录接口,用户名和密码检验成功就生成token
```
const generateJWT = (uid) => {
  const payload = {
    userId: uid,
    exp: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60
  }
  return JWT.sign(payload, process.env.JWT_SECRET)
}
handler () {
      const res = await models.user.findAll({
        attributes: {
          exclude: ['password', 'created_time', 'updated_time']
        },
        where: {
          username: request.payload.username,
          password: request.payload.password
        }
      })
      const data = res[0]
      if (res.length > 0) {
        return h.response({
          code: 0,
          message: '登录成功!',
          data: {
            token: generateJWT(data.uid),
            ...data.dataValues
          }
        })
      } else {
        return h.response({
          code: 10,
          message: '用户名或密码错误'
        })
      }
    }
```
前端拿到toke塞在头部就好了
client/api/index.ts
```
request.interceptors.request.use((config: AxiosRequestConfig): AxiosRequestConfig => {
  const token = getToken()
  if (token) { config.headers.authorization = token }
  return config
})
```
5. 请求头增加Joi校验
```
const jwtHeaderDefine = {
  headers: Joi.object({
    authorization: Joi.string().required()
  }).unknown()
}
// 某个接口
...
validate: {
        ...jwtHeaderDefine,
        params: {
          uid: Joi.string().required()
        }
      }
...
```
可以从swagger在线文档中文看出变化

## 2.6 加入分页hapi-pagination

1. 安装
npm i hapi-pagination@3
2. 配置
plugins/hapi-pagination.js
```
const hapiPagination = require('hapi-pagination')
const options = {
  query: {
    page: {
      name: 'the_page' // The page parameter will now be called the_page
    },
    limit: {
      name: 'per_page', // The limit will now be called per_page
      default: 10 // The default value will be 10
    }
  },
  meta: {
    location: 'body', // The metadata will be put in the response body
    name: 'metadata', // The meta object will be called metadata
    count: {
      active: true,
      name: 'count'
    },
    pageCount: {
      name: 'totalPages'
    },
    self: {
      active: false // Will not generate the self link
    },
    first: {
      active: false // Will not generate the first link
    },
    last: {
      active: false // Will not generate the last link
    }
  },
  routes: {
    include: ['/article'] // 需要开启的路由
  }
}
module.exports = {
  plugin: hapiPagination,
  options
}
```
3. 注册插件
```
const pluginHapiPagination = require('./plugins/hapi-pagination');
await server.register([
  pluginHapiPagination,
])
```
4. 加入参数校验
```
const paginationDefine = {
  limit: Joi.number().integer().min(1).default(10)
    .description('每页的条目数'),
  page: Joi.number().integer().min(1).default(1)
    .description('页码数'),
  pagination: Joi.boolean().description('是否开启分页，默认为true')
}
// 某个接口
// joi校验
...
validate: {
        query: {
          ...paginationDefine
        }
      }
...
```
5. 数据库查询
```
   const { rows: results, count: totalCount } = await models.xxxx.findAndCountAll({
      limit: request.query.limit,
      offset: (request.query.page - 1) * request.query.limit,
    });
```

# 3 最后
欢迎到线上地址体验完整功能
#### 1 踩坑总结:

- 碰到接口500的情况，可以在model的操作后面捕获错误,比如models.findAll().catch(e => console.log(e))
- 注意版本兼容问题，插件和hapi或者nuxt版本的兼容
- nuxt.config.ts的配置不生效可以执行tsc nuxt.config.ts手动编译
- 在asyncData中请数据，不写绝对地址，会默认请求80端口的

#### 2 开发收获
- 熟悉了基本的后端开发流程
- 插件不兼容或者有其他需求的情况下，必须自己看英文文档,看到英文文档能淡定了
- 后端开发需要做的工作蛮多的，从接口到部署等，以后工作中要相互理解

#### 3 参考
[掘金小册: 叶盛飞 《基于 hapi 的 Node.js 小程序后端开发实践指南》](https://juejin.im/book/5b63fdba6fb9a04fde5ae6d0)

ps:欢迎点赞star ^_^
**github**: [https://github.com/huoguozhang/my-blog](https://github.com/huoguozhang/my-blog)
