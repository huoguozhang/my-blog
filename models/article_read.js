const moment = require('moment')
module.exports = (sequelize, DataTypes) => sequelize.define(
  'article_read',
  {
    uid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    article_uid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    received: DataTypes.BIGINT,
    request_id: DataTypes.STRING,
    client_id: DataTypes.STRING,
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
    tableName: 'article_read'
  }
)
