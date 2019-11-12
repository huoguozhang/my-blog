'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'article_like',
    {
      uid: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      like_status: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      author: {
        type: Sequelize.UUID,
        allowNull: false
      },
      article_uid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      created_time: Sequelize.DATE,
      updated_time: Sequelize.DATE
    },
    {
      charset: 'utf8'
    }
  ),

  down: queryInterface => queryInterface.dropTable('article_like')
}
