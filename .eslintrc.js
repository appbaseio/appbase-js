module.exports = {
  extends: 'airbnb/base',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: 'babel-eslint',
  rules: {
    indent: 0,
    'no-tabs': 0,
    'eol-last': ['error', 'always'],
    'no-underscore-dangle': 0,
  },
};
