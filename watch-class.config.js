module.exports = {
  // 监听目录
  watchDirs: ['./test/src'],
  
  // 监听文件后缀
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html'],
  
  // 输出文件后缀
  outputExtension: '.css',
  
  // 单位
  unit: 'px',
  
  // 输出目录
  outputDir: './test/src',
  
  // 规则配置
  rules: [
    // 自定义规则示例
    // {
    //   pattern: /^custom-(.+)$/,
    //   generate: (match) => `/* 自定义样式: ${match[1]} */`
    // }
    {
      pattern: /^custom-bg-(.+)$/,
      generate: (match) => `background: ${match[1]};`
    },
  ]
};