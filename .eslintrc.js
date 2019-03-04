module.exports = {
  root: true,
  globals: {
      "Ember": true,
      "swal": true,
      "go": true,
      "window": true,
      "Promise": true,
      "Uint8Array": true,
      "JSONTree": true,
      "$": true,
      "saveAs": true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    'browser': true
  },
  rules: {
    "no-mixed-spaces-and-tabs": [0],
    "no-unused-vars": 0,
    "comma-dangle": 0,
    "no-console": 0,
    "no-empty": 0,
    "no-extra-boolean-cast": 0,
    "no-case-declarations": 0
  }
};
