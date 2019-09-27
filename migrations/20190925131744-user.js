'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
  'user',
  {
    uid: {
      type: Sequelize.UUID
    },
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nickname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
  },
  {
    charset: 'utf8'
  }
  ),

  down: queryInterface => queryInterface.dropTable('user')
}
