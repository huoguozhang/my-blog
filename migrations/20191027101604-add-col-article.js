'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('article', 'read_num', {
          type: Sequelize.INTEGER,
          defaultValue: 0
        })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('article', 'read_num', { transaction: t })
      ])
    })
  }
};
