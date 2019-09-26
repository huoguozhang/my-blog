'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'article',
    {
      uid: {
        type: Sequelize.UUID
      },
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
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
      updated_time: Sequelize.DATE,
    },
  {charset: 'utf8'}
  ),

  down: queryInterface => queryInterface.dropTable('article')
}
