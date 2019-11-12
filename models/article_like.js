const moment = require('moment')
module.exports = (sequelize, DataTypes) => sequelize.define(
  'article_like',
  {
    uid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    like_status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    author: {
      type: DataTypes.UUID,
      allowNull: false
    },
    article_uid: {
      type: DataTypes.UUID,
      allowNull: false
    },
    article_author: {
      type: DataTypes.UUID,
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
    tableName: 'article_like'
  }
)
