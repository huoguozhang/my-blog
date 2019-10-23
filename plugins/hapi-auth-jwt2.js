const validate = (decoded) => {
  // eslint disable
  // decoded 为 JWT payload 被解码后的数据
  const { exp } = decoded
  if (new Date(exp * 1000) < new Date()) {
    const response = {
      code: 4,
      message: '登录过期',
      data: null
    }
    return { isValid: true, response }
  }
  return { isValid: true }
}

module.exports = (server) => {
  server.auth.strategy('jwt', 'jwt', {
    // 需要自行在 config/index.js 中添加 jwtSecret 的配置，并且通过 process.env.JWT_SECRET 来进行 .git 版本库外的管理。
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: {
      ignoreExpiration: true
    }
  })
  server.auth.default('jwt')
}
