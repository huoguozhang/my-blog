'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'article',
    {
      uid: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      author: Sequelize.UUID,
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      summary: Sequelize.STRING,
      created_time: Sequelize.DATE,
      updated_time: {
        type: Sequelize.DATE,
        detaultValue: Sequelize.NOW
      }
    },
    {
      charset: 'utf8',
      updatedAt: false
    }
  ),

  down: queryInterface => queryInterface.dropTable('article')
}
