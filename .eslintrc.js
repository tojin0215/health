module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // 'module' is not defined. 에러가 발생하면 기입
  },
  extends: [
    'eslint:recommended',
    /**
     * Failed to load plugin 'eslint' declared in '.eslintrc.js': Cannot find module 'eslint-plugin-eslint' 에러로 인한 제거
     * 제거 항목 : 'plugin:eslint/recommended',
     */
    // 'plugin:eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'prettier',
    'eslint-config-prettier',
    // 'standard',
    'plugin:react/jsx-runtime',
    'plugin:testing-library/react',
    // 'plugin:jest/all',
  ],
  //   parser: 'babel-eslint',
  parser: '@babel/eslint-parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    requireConfigFile: 'false',
    sourceType: 'module',
    allowImportExportEverywhere: true,
    babelOptions: { configFile: './.babelrc' },
  },
  plugins: ['react'],
  /**
   * rules : 에러 또는 경고 규칙을 설정할 수 있다.
   * 0: 끄기, 1: 경고 출력, 2: 에러 출력
   */
  rules: {
    'no-unused-vars': 1,
    'no-dupe-class-members': 1,
    'no-dupe-keys': 1,
    'no-prototype-builtins': 1,
    'no-empty': 1,
    'no-useless-escape': 1,
    'no-unreachable': 1,
    'no-constant-condition': 1,
    'no-self-assign': 1,

    //plugin:react/recommended
    'react/prop-types': 1,
    'react/jsx-key': 1,
    'react/no-unknown-property': 1,
    'react/no-unescaped-entities': 1,
    'react/no-direct-mutation-state': 1,

    //plugin:import/errors
    'import/named': 1,
    'import/default': 1,
    // 'import/no-unresolved': 'off',

    //plugin:prettier/recommended
    'prettier/prettier': 0,

    'import/namespace': 1,
    /*
    외부 소스로 가져왔으므로 오류 확인 및 기능 적합 확인 후 적용
    'no-restricted-globals': 1,
    'eslint-plugin/require-meta-docs-description': 'error',
    'no-extra-semi': 'error', // 확장자로 js와 jsx 둘다 허용하도록 수정
    'react/jsx-filename-extension': [1, { extensions: ['js', 'jsx'] }], // 화살표 함수의 파라미터가 하나일때 괄호 생략
    'arrow-parens': ['warn', 'as-needed'], // 사용하지 않는 변수가 있을때 빌드에러가 나던 규칙 해제
    'no-unused-vars': ['off'], // 콘솔을 쓰면 에러가 나던 규칙 해제
    'no-console': ['off'], // export const 문을 쓸때 에러를 내는 규칙 해제
    'import/prefer-default-export': ['off'], // hooks의 의존성배열이 충분하지 않을때 강제로 의존성을 추가하는 규칙을 완화
    'react-hooks/exhaustive-deps': ['warn'], // props spreading을 허용하지 않는 규칙 해제
    'react/jsx-props-no-spreading': [1, { custom: 'ignore' }],
    'no-restricted-globals': 1,
    'react/jsx-no-undef': 1,
    */
  },
};
