const moment = require('moment')

const Article = (sequelize, DataTypes) => sequelize.define(
  'article',
  {
    uid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: DataTypes.STRING,
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    summary: DataTypes.STRING,
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
    },
    read_num: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    word_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    cover: {
      type: DataTypes.STRING
    }
  },
  {
    tableName: 'article'
  }
)

module.exports = Article
