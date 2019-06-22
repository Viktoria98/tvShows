module.exports = {
  extends: [
    'airbnb',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    $: true,
    HTTP: true,
    Action: true,
    NProgress: true,
    StripeButton: true,
    StripeCheckout: true,
  },
  rules: {
    'react/jsx-key': 'error',
    'react/display-name': ['error', { ignoreTranspilerName: true }],
    'react/prefer-es6-class': 'off',
    'react/no-string-refs': 'off',
    'class-methods-use-this': 'off',
    'react/forbid-prop-types': 'off',
    'react/no-array-index-key': 'off',
    'react/no-find-dom-node': 'warn',
    'newline-per-chained-call': ["error", { ignoreChainWithDepth: 1 }],
    'indent': ['error', 2, {
      SwitchCase: 1,
      VariableDeclarator: 1,
      outerIIFEBody: 1,
      MemberExpression: 1,
      ArrayExpression: 1,
      FunctionDeclaration: {
        parameters: 1,
        body: 1
      },
      FunctionExpression: {
        parameters: 1,
        body: 1
      }
    }],
    'react/require-default-props': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/label-has-for': 'off',
    'space-before-function-paren': ['error', 'always'],
    'no-use-before-define': ['error', { functions: false }],
    curly: ['error', 'all'],
    'arrow-parens': ['error', 'always'],
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'brace-style': ["error", "1tbs"],
    "no-underscore-dangle": 'warn',
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
  }
};
