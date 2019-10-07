const validate = (decoded, request, h) => {
  // decoded 为 JWT payload 被解码后的数据
  const { userId } = decoded
  console.log(decoded)
  return { isValid: true }
}

module.exports = (server) => {
  server.auth.strategy('jwt', 'jwt', {
    // 需要自行在 config/index.js 中添加 jwtSecret 的配置，并且通过 process.env.JWT_SECRET 来进行 .git 版本库外的管理。
    key: process.env.JWT_SECRET,
    validate
  });
  server.auth.default('jwt');
};
