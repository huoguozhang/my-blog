const moment = require('moment')
module.exports = (sequelize, DataTypes) => sequelize.define(
  'user',
  {
    uid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    nickname: {
      type: DataTypes.STRING
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
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
