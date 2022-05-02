module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    // import 관련 규칙 모음

    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/react",
    // prettier 관련 규칙 모음
  ],
  parserOptions: {
    ecmaVersion: 2018,
    project: ["./tsconfig.json"],
    // tsconfig 파일의 경로를 참조 해줍니다.
    // 기준은 root 입니다.
  },
  rules: {
    // 추가하고 싶은 rule을 더 추가해줍니다.
  },
};
