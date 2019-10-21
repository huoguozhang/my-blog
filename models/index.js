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

db.user.hasMany(db.article, { foreignKey: 'uid' })
db.article.belongsTo(db.user, { foreignKey: 'author' })

module.exports = db
