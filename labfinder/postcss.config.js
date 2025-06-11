// postcss.config.cjs
module.exports = {
  plugins: {
    // 기존 tailwindcss 대신, 분리된 패키지를 가리킵니다
    "@tailwindcss/postcss": {},
    // autoprefixer는 그대로
    autoprefixer: {},
  },
}
