'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(() => {
      return Promise.all([
        queryInterface.addColumn('article', 'word_count', {
          type: Sequelize.INTEGER,
          defaultValue: 0
        })
      ])
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('article', 'word_count', { transaction: t })
      ])
    })
  }
}
