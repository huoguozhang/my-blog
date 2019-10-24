'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'comment',
    {
      uid: {
        type: Sequelize.UUID,
        primaryKey: true
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
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

  down: queryInterface => queryInterface.dropTable('comment')
};
