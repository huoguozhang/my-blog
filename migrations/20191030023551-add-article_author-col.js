'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(() => {
      return Promise.all([
        queryInterface.addColumn('article_like', 'article_author', {
          type: Sequelize.UUID,
          allowNull: false
        }),
        queryInterface.addColumn('comment', 'article_author', {
          type: Sequelize.UUID,
          allowNull: false
        })
      ])
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('article_like', 'article_author', { transaction: t }),
        queryInterface.removeColumn('comment', 'article_author', { transaction: t })
      ])
    })
  }
}
