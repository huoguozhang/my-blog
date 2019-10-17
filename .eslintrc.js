module.exports = {
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 1,
    'vue/no-v-html': 0,
    'vue/html-self-closing': 0,
    'no-console': 0,
    'prefer-const': 0
  }
}
