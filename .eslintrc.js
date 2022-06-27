module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'plugin:prettier/recommended', 'prettier', 'prettier/vue'],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-undef': 'off',
    'no-console': 'off',
    'no-debugger': 'off',
    'prettier/prettier': 'warn'
  }
}
