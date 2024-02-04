
/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    "plugin:sonarjs/recommended"
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint',
    "import"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  settings: {
    'import/resolver': {
      "typescript": {
      }
    }
  },
  ignorePatterns: ['.eslintrc.js', 'jest.config.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    'no-useless-constructor': 'off',
    'no-empty-function': ['error', {'allow': ['constructors']}],
    'import/prefer-default-export': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../*'],
      },
    ],
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          ["sibling", "parent"],
          "index",
          "unknown"
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "ts": "never",
      }
    ],
    "class-methods-use-this": "off",
    "import/no-extraneous-dependencies":[
      "error",
      {
         "devDependencies":[
            "**/*.spec.ts",
            "test/**/*",
         ]
      }
    ],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
  },
};
