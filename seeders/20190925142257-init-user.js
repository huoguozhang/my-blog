'use strict';
const uuid = require('uuid')
let id = Math.floor(Math.random() * 10000)
const timeStamp = {
  created_time: new Date(),
  updated_time: new Date()
}
module.exports = {
  up: queryInterface => queryInterface.bulkInsert(
    'user',
    [
      {uid: uuid(), username: 'zlj1', id: ++id, password: '123', nickname: '火锅1', ...timeStamp},
      {uid: uuid(), username: 'zlj2', id: ++id, password: '123', nickname: '火锅2', ...timeStamp},
      {uid: uuid(), username: 'zlj3', id: ++id, password: '123', nickname: '火锅3', ...timeStamp},
      {uid: uuid(), username: 'zlj4', id: ++id, password: '123', nickname: '火锅4', ...timeStamp},

    ],
    {
      charset: 'utf-8'
    },
  ),

  down: (queryInterface, Sequelize) => {
    const {Op} = Sequelize;
    // 删除 shop 表 id 为 1，2，3，4 的记录
    return queryInterface.bulkDelete('user', {id: {[Op.in]: [1, 2, 3, 4]}}, {});
  },
};
