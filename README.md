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
  // 基础配置
  watchDirs: ['./src'],                    // 监听的目录
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html'],  // 监听的文件类型
  
  // 输出配置
  output: {
    dir: './src/styles',                   // 输出目录
    extension: '.css',                     // 输出文件后缀
    fileName: 'generated',                 // 输出文件名
    minify: false,                         // 是否压缩
    sourceMap: false,                      // 是否生成 sourceMap
    autoPrefix: true,                      // 是否自动添加前缀
    important: false,                      // 是否添加 !important
    classPrefix: '',                       // 类名前缀
  },

  // 单位配置
  units: {
    default: 'px',                         // 默认单位
    spacing: 'px',                         // margin, padding 等间距单位
    fontSize: 'px',                        // 字体大小单位
    lineHeight: '',                        // 行高单位（空为无单位数值）
    borderWidth: 'px'                      // 边框宽度单位
  },

  // 性能配置
  performance: {
    debounceTime: 300,                     // 防抖时间
    cache: true,                           // 是否启用缓存
    cacheFile: '.watch-class-cache'        // 缓存文件名
  },

  // 日志配置
  logger: {
    level: 'info',                         // 日志级别：debug, info, warn, error
    timestamp: true,                       // 是否显示时间戳
    saveToFile: false,                     // 是否保存到文件
    logFile: './watch-class.log'           // 日志文件路径
  },

  // 排除配置
  exclude: {
    patterns: ['node_modules/**', 'dist/**'],  // 排除的文件模式
    classNames: ['ant-', 'el-']                // 排除的类名前缀
  },

  // 媒体查询配置
  mediaQueries: {
    sm: '640px',                           // 小屏幕断点
    md: '768px',                           // 中等屏幕断点
    lg: '1024px',                          // 大屏幕断点
    xl: '1280px',                          // 超大屏幕断点
    '2xl': '1536px'                        // 2倍超大屏幕断点
  },

  // 主题配置
  theme: {
    colors: {
      primary: '#3b82f6',                  // 主要颜色
      secondary: '#6b7280',                // 次要颜色
      success: '#10b981',                  // 成功颜色
      warning: '#f59e0b',                  // 警告颜色
      danger: '#ef4444',                   // 危险颜色
    },
    spacing: {
      sm: '0.5rem',                        // 小间距
      md: '1rem',                          // 中等间距
      lg: '1.5rem',                        // 大间距
      xl: '2rem'                           // 超大间距
    },
    borderRadius: {
      sm: '0.125rem',                      // 小圆角
      md: '0.375rem',                      // 中等圆角
      lg: '0.5rem',                        // 大圆角
      xl: '0.75rem'                        // 超大圆角
    }
  },

  // 规则配置
  rules: [
    // 更多规则配置请参考"支持的规则"章节
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

## 支持的规则

### 布局规则
- `w-{number}` => `width: {number}px`
- `h-{number}` => `height: {number}px`
- `min-w-{number}` => `min-width: {number}px`
- `max-w-{number}` => `max-width: {number}px`
- `min-h-{number}` => `min-height: {number}px`
- `max-h-{number}` => `max-height: {number}px`
- `w-full` => `width: 100%`
- `h-full` => `height: 100%`
- `w-screen` => `width: 100vw`
- `h-screen` => `height: 100vh`

### 间距规则
- `m-{number}` => `margin: {number}px`
- `mt-{number}` => `margin-top: {number}px`
- `mr-{number}` => `margin-right: {number}px`
- `mb-{number}` => `margin-bottom: {number}px`
- `ml-{number}` => `margin-left: {number}px`
- `p-{number}` => `padding: {number}px`
- `pt-{number}` => `padding-top: {number}px`
- `pr-{number}` => `padding-right: {number}px`
- `pb-{number}` => `padding-bottom: {number}px`
- `pl-{number}` => `padding-left: {number}px`

### 颜色规则
- `c-{color}` => `color: {color}` (支持颜色名称、十六进制)
- `text-{color}` => `color: {color}`
- `bg-{color}` => `background-color: {color}`
- `background-{color}` => `background-color: {color}`
- `border-{color}` => `border-color: {color}`

### Flex布局
- `flex` => `display: flex`
- `flex-row` => `flex-direction: row`
- `flex-col` => `flex-direction: column`
- `flex-row-reverse` => `flex-direction: row-reverse`
- `flex-col-reverse` => `flex-direction: column-reverse`
- `flex-wrap` => `flex-wrap: wrap`
- `flex-nowrap` => `flex-wrap: nowrap`
- `flex-{number}` => `flex: {number}`
- `gap-{number}` => `gap: {number}px`

### 对齐方式
- `justify-start` => `justify-content: flex-start`
- `justify-end` => `justify-content: flex-end`
- `justify-center` => `justify-content: center`
- `justify-between` => `justify-content: space-between`
- `justify-around` => `justify-content: space-around`
- `justify-evenly` => `justify-content: space-evenly`
- `items-start` => `align-items: flex-start`
- `items-end` => `align-items: flex-end`
- `items-center` => `align-items: center`
- `items-baseline` => `align-items: baseline`
- `items-stretch` => `align-items: stretch`

### 定位规则
- `static` => `position: static`
- `relative` => `position: relative`
- `absolute` => `position: absolute`
- `fixed` => `position: fixed`
- `sticky` => `position: sticky`
- `top-{number}` => `top: {number}px`
- `right-{number}` => `right: {number}px`
- `bottom-{number}` => `bottom: {number}px`
- `left-{number}` => `left: {number}px`
- `z-{number}` => `z-index: {number}`

### 字体规则
- `fs-{number}` => `font-size: {number}px`
- `fw-{weight}` => `font-weight: {weight}` (normal, bold, 或数字)
- `line-{number}` => `line-height: {number}`
- `text-left` => `text-align: left`
- `text-right` => `text-align: right`
- `text-center` => `text-align: center`
- `text-justify` => `text-align: justify`

### 边框规则
- `rounded-{number}` => `border-radius: {number}px`
- `rounded-full` => `border-radius: 9999px`
- `border-{number}` => `border-width: {number}px`
- `border-solid` => `border-style: solid`
- `border-dashed` => `border-style: dashed`
- `border-dotted` => `border-style: dotted`
- `border-none` => `border-style: none`

### 显示规则
- `block` => `display: block`
- `inline` => `display: inline`
- `inline-block` => `display: inline-block`
- `grid` => `display: grid`
- `none` => `display: none`

### 溢出规则
- `overflow-auto` => `overflow: auto`
- `overflow-hidden` => `overflow: hidden`
- `overflow-visible` => `overflow: visible`
- `overflow-scroll` => `overflow: scroll`
- `clamp-{number}` => 文本限制行数

### 其他规则
- `opacity-{number}` => `opacity: 0.{number}`
- `cursor-pointer` => `cursor: pointer`
- `select-none` => `user-select: none`
- `whitespace-nowrap` => `white-space: nowrap`
- `break-words` => `word-break: break-word`

### 响应式设计
支持以下响应式前缀：
- `sm:` => `@media (min-width: 640px)`
- `md:` => `@media (min-width: 768px)`
- `lg:` => `@media (min-width: 1024px)`
- `xl:` => `@media (min-width: 1280px)`
- `2xl:` => `@media (min-width: 1536px)`

使用示例：`sm:w-100` 在屏幕宽度大于640px时生效