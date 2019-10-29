'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(() => {
      return Promise.all([
        queryInterface.addColumn('article', 'cover', {
          type: Sequelize.STRING
        })
      ])
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('article', 'cover', { transaction: t })
      ])
    })
  }
}
