'use strict';
const uuid = require('uuid')
const timestamps = {
  created_time: new Date(),
  updated_time: new Date(),
}
let id = 10000
module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'user',
    [
      {uid: uuid(), username: 'zlj1', id: ++id, password: '123', nickname: '火锅01',  ...timestamps},
      {uid: uuid(), username: 'zlj2', id: ++id, password: '123', nickname: '火锅02',  ...timestamps},
      {uid: uuid(), username: 'zlj3', id: ++id, password: '123', nickname: '火锅03',  ...timestamps},
      {uid: uuid(), username: 'zlj4', id: ++id, password: '123', nickname: '火锅04',  ...timestamps},

    ],
    {},
  ),

  down: (queryInterface, Sequelize) => {
    const {Op} = Sequelize;
    // 删除 shop 表 id 为 1，2，3，4 的记录
    return queryInterface.bulkDelete('user', {id: {[Op.in]: [1, 2, 3, 4]}}, {});
  },
};
