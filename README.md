# Watch Class Generator

一个自动监听前端文件中的class并生成对应样式文件的工具。

## 特性

- 自动监听文件变化，实时生成样式
- 可自定义监听目录和文件类型
- 可自定义样式生成规则
- 支持多种前端框架（React, Vue等）
- 友好的命令行提示

## 安装

```bash
npm install -g watch-class-generator
```

## 使用方法

### 初始化配置

```bash
watch-class init
```

这将在当前目录生成一个`watch-class.config.js`配置文件。

### 开始监听

```bash
watch-class watch
```

### 一次性生成

```bash
watch-class generate
```

### 指定配置文件

```bash
watch-class watch -c custom-config.js
```

## 规则配置

配置文件`watch-class.config.js`示例：

```javascript
module.exports = {
  // 监听目录
  watchDirs: ['./src'],
  
  // 监听文件后缀
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html'],
  
  // 输出文件后缀
  outputExtension: '.css',
  
  // 单位
  unit: 'px',
  
  // 输出目录
  outputDir: './src/styles',
  
  // 规则配置
  rules: [
    // 宽度规则
    {
      pattern: /^w-(\d+)$/,
      generate: (match) => `width: ${match[1]}${module.exports.unit};`
    },
    // 高度规则
    {
      pattern: /^h-(\d+)$/,
      generate: (match) => `height: ${match[1]}${module.exports.unit};`
    },
    // 更多规则...
  ]
};
```

### 规则定义说明

每个规则包含两个部分：

1. `pattern`: 正则表达式，用于匹配class名称
2. `generate`: 函数，接收匹配结果，返回CSS属性

例如，规则`w-100` => `width: 100px`的配置如下：

```javascript
{
  pattern: /^w-(\d+)$/,
  generate: (match) => `width: ${match[1]}px;`
}
```

### 常用规则示例

- 宽度: `w-100` => `width: 100px`
- 高度: `h-100` => `height: 100px`
- 外边距: `m-10` => `margin: 10px`
- 内边距: `p-10` => `padding: 10px`
- 字体大小: `fs-16` => `font-size: 16px`
- 颜色: `c-red` => `color: red`
- 背景色: `bg-blue` => `background-color: blue`

## 在项目中使用

1. 安装依赖

```bash
npm install --save-dev watch-class-generator
```

2. 在`package.json`中添加脚本

```json
"scripts": {
  "watch-class": "watch-class watch",
  "generate-class": "watch-class generate"
}
```

3. 运行脚本

```bash
npm run watch-class
```

4. 在项目中使用生成的样式

```html
<!-- 引入生成的样式文件 -->
<link rel="stylesheet" href="./src/styles/generated.css">

<!-- 在HTML中使用class -->
<div class="w-100 h-50 m-10 c-red bg-blue">
  这个div将应用自动生成的样式
</div>
```

5. 自定义配置

在项目根目录创建`watch-class.config.js`文件，根据项目需求自定义规则。
```