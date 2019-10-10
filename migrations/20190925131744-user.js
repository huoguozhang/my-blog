'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
  'user',
  {
    uid: {
      type: Sequelize.UUID,
      primaryKey: true
    },
    nickname: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    created_time: Sequelize.DATE,
    updated_time: Sequelize.DATE
  },
  {
    charset: 'utf8'
  }
  ),

  down: queryInterface => queryInterface.dropTable('user')
}
