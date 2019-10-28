'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'article_read',
    {
      uid: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      article_uid: {
        type: Sequelize.UUID,
        allowNull: false
      },
      client_id: Sequelize.STRING,
      received: Sequelize.BIGINT,
      request_id: Sequelize.STRING,
      updated_time: Sequelize.DATE,
      created_time: Sequelize.DATE
    },
    {
      charset: 'utf8'
    }
  ),

  down: queryInterface => queryInterface.dropTable('article_read')
}
