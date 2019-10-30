const models = require('./models')
async function start() {
  for(let i = 0; i < 10 ; i++) {
    await models.user.create({
      username: 'test' + i,
      nickname: 'test' + i,
      password: 'test' + i
    })
  }
}
start()
console.log('done')
