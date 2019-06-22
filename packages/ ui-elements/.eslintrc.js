module.exports = {
  extends: ['airbnb'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }], // Easy to read chain transformation (one action per line)
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        ArrayExpression: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
      },
    ],
    'space-before-function-paren': ['error', 'always'], // Easy to "grep" function definition
    curly: ['error', 'all'], // Omit possible errors when rebase branches
    'arrow-parens': ['error', 'always'],
    'brace-style': ['error', '1tbs'],
    'comma-dangle': [
      'error', // Minify git diffs
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
  },
};
