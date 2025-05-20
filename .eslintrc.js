module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
      alias: {
        map: [
          ['@utils', './src/utils'],
          ['@contexts', './src/contexts'],
          ['@styles', './src/styles'],
          ['@objects', './src/objects'],
          ['@background', './src/background'],
          ['@components', './src/components'],
          ['@stores', './src/stores'],
          ['@hooks', './src/hooks'],
          ['@enums', './azusa-player-mobile/src/enums'],
          ['@APM', './azusa-player-mobile/src'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', 'ts', 'tsx'],
      },
    },
  },
  rules: {
    'no-unused-expressions': 'off',
    // HACK: breaks youtubei.js
    'import/no-cycle': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'import/extensions': [
      'warn',
      {
        js: 'never',
        jsx: 'never',
        tsx: 'never',
        ts: 'never',
      },
    ],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['off'], // solves 'React' was used before it was defined
    'space-before-function-paren': 0,
    'react/prop-types': 0,
    'react/jsx-handler-names': 0,
    'react/jsx-fragments': 0,
    'react/no-unused-prop-types': 0,
    'no-console': 'off',
    'linebreak-style': 0,
    'operator-linebreak': 'off',
    'max-len': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    // i dont think this works well with typescript...
    'react/require-default-props': 'off',
    'no-param-reassign': 'off',
    'consistent-return': 'off',
    // i use <<.
    'no-bitwise': 'off',
    // for the convenience to work with stupid async chrome API calls.
    'no-await-in-loop': 'off',
    'no-nested-ternary': 'off',
    'react/no-array-index-key': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
  },
};
