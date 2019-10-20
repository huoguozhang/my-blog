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
    created_time: DataTypes.DATE,
    updated_time: DataTypes.DATE
  },
  {
    tableName: 'article'
  }
)

module.exports = Article
