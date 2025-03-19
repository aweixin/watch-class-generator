const rules = require("./src/rules");

module.exports = {

  // 基础配置
  watchDirs: ['./test/src'],
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html', '.wxml'],
  // 输出配置
  output: {
    dir: './test/src',
    extension: '.css',
    fileName: 'generated',
    minify: false,
    sourceMap: false,
    autoPrefix: true,
    important: false,
    classPrefix: '',
  },
  rules: [
   
  ]
}