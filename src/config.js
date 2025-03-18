const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// 默认配置
const defaultConfig = {
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
    {
      // 宽度规则，例如: w-100 => width: 100px
      pattern: /^w-(\d+)$/,
      generate: (match) => `width: ${match[1]}${defaultConfig.unit};`
    },
    {
      // 高度规则，例如: h-100 => height: 100px
      pattern: /^h-(\d+)$/,
      generate: (match) => `height: ${match[1]}${defaultConfig.unit};`
    },
    {
      // margin规则，例如: m-10 => margin: 10px
      pattern: /^m-(\d+)$/,
      generate: (match) => `margin: ${match[1]}${defaultConfig.unit};`
    },
    {
      // padding规则，例如: p-10 => padding: 10px
      pattern: /^p-(\d+)$/,
      generate: (match) => `padding: ${match[1]}${defaultConfig.unit};`
    },
    {
      // 字体大小规则，例如: fs-16 => font-size: 16px
      pattern: /^fs-(\d+)$/,
      generate: (match) => `font-size: ${match[1]}${defaultConfig.unit};`
    },

// margin规则
{
  pattern: /^m-(\d+)$/,
  generate: (match) => `margin: ${match[1]}${module.exports.unit};`
},
{
  pattern: /^mt-(\d+)$/,
  generate: (match) => `margin-top: ${match[1]}${module.exports.unit};`
},
{
  pattern: /^mr-(\d+)$/,
  generate: (match) => `margin-right: ${match[1]}${module.exports.unit};`
},
{
  pattern: /^mb-(\d+)$/,
  generate: (match) => `margin-bottom: ${match[1]}${module.exports.unit};`
},
{
  pattern: /^ml-(\d+)$/,
  generate: (match) => `margin-left: ${match[1]}${module.exports.unit};`
},

// padding规则
{
  pattern: /^p-(\d+)$/,
  generate: (match) => `padding: ${match[1]}${module.exports.unit};`
},
{
  pattern: /^pt-(\d+)$/,
  generate: (match) => `padding-top: ${match[1]}${module.exports.unit};`
},
{
  pattern: /^pr-(\d+)$/,
  generate: (match) => `padding-right: ${match[1]}${module.exports.unit};`
},
{
  pattern: /^pb-(\d+)$/,
  generate: (match) => `padding-bottom: ${match[1]}${module.exports.unit};`
},
{
  pattern: /^pl-(\d+)$/,
  generate: (match) => `padding-left: ${match[1]}${module.exports.unit};`
},

      // 颜色规则，例如: c-red => color: red
      // 颜色规则
      {
        pattern: /^(c|color|text)-(.+)$/,
        generate: (match) => {
          const color = match[2];
          if (color.startsWith('#')) {
            return `color: ${color};`;
          }
          if (/^[a-zA-Z]+$/.test(color)) {
            return `color: ${color};`;
          }
          return `color: #${color};`;
        }
      },
      
      // 背景颜色规则
      {
        pattern: /^(bg|background)-(.+)$/,
        generate: (match) => {
          const color = match[2];
          if (color.startsWith('#')) {
            return `background-color: ${color};`;
          }
          if (/^[a-zA-Z]+$/.test(color)) {
            return `background-color: ${color};`;
          }
          return `background-color: #${color};`;
        }
      },

    // Display 规则
    {
      pattern: /^(block|inline|inline-block|flex|grid|none)$/,
      generate: (match) => `display: ${match[1]};`
    },

    // Float 规则
    {
      pattern: /^float-(left|right|none)$/,
      generate: (match) => `float: ${match[1]};`
    },

    // Object-fit 规则
    {
      pattern: /^object-(contain|cover|fill|none|scale-down)$/,
      generate: (match) => `object-fit: ${match[1]};`
    },

    // Object-position 规则
    {
      pattern: /^object-(top|bottom|center|left|right)$/,
      generate: (match) => `object-position: ${match[1]};`
    },

    // Overflow 规则
    {
      pattern: /^overflow-(auto|hidden|visible|scroll)$/,
      generate: (match) => `overflow: ${match[1]};`
    },

    // Position 规则
    {
      pattern: /^(static|relative|absolute|fixed|sticky)$/,
      generate: (match) => `position: ${match[1]};`
    },

    // Visibility 规则
    {
      pattern: /^(visible|invisible|collapse)$/,
      generate: (match) => `visibility: ${match[1]};`
    },

    // Top, Right, Bottom, Left 规则
    {
      pattern: /^(top|right|bottom|left)-(\d+)$/,
      generate: (match) => `${match[1]}: ${match[2]}${defaultConfig.unit};`
    },

    // Z-index 规则
    {
      pattern: /^z-(\d+)$/,
      generate: (match) => `z-index: ${match[1]};`
    },

    // Flex 相关规则
    {
      pattern: /^flex-(row|col|row-reverse|col-reverse)$/,
      generate: (match) => {
        const value = match[1].replace('col', 'column');
        return `flex-direction: ${value};`;
      }
    },
    {
      pattern: /^flex-(wrap|nowrap|wrap-reverse)$/,
      generate: (match) => `flex-wrap: ${match[1]};`
    },
    {
      pattern: /^flex-(\d+)$/,
      generate: (match) => `flex: ${match[1]};`
    },
    {
      pattern: /^gap-(\d+)$/,
      generate: (match) => `gap: ${match[1]}${defaultConfig.unit};`
    },

    // Justify & Align 规则
    {
      pattern: /^justify-(start|end|center|between|around|evenly)$/,
      generate: (match) => `justify-content: ${match[1].replace('between', 'space-between').replace('around', 'space-around').replace('evenly', 'space-evenly')};`
    },
    {
      pattern: /^items-(start|end|center|baseline|stretch)$/,
      generate: (match) => `align-items: ${match[1]};`
    },

    // Width & Height 限制
    {
      pattern: /^min-w-(\d+)$/,
      generate: (match) => `min-width: ${match[1]}${defaultConfig.unit};`
    },
    {
      pattern: /^max-w-(\d+)$/,
      generate: (match) => `max-width: ${match[1]}${defaultConfig.unit};`
    },
    {
      pattern: /^min-h-(\d+)$/,
      generate: (match) => `min-height: ${match[1]}${defaultConfig.unit};`
    },
    {
      pattern: /^max-h-(\d+)$/,
      generate: (match) => `max-height: ${match[1]}${defaultConfig.unit};`
    },

    // 字体相关规则
    {
      pattern: /^fw-(normal|bold|\d+)$/,
      generate: (match) => `font-weight: ${match[1]};`
    },
    {
      pattern: /^line-(\d+)$/,
      generate: (match) => `line-height: ${match[1]};`
    },
    {
      pattern: /^clamp-(\d+)$/,
      generate: (match) => `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: ${match[1]}; overflow: hidden;`
    },

    // 文本对齐
    {
      pattern: /^text-(left|right|center|justify)$/,
      generate: (match) => `text-align: ${match[1]};`
    },

    // Border 相关规则
    {
      pattern: /^rounded-(\d+)$/,
      generate: (match) => `border-radius: ${match[1]}${defaultConfig.unit};`
    },
    {
      pattern: /^border-(\d+)$/,
      generate: (match) => `border-width: ${match[1]}${defaultConfig.unit};`
    },
    {
      pattern: /^border-(solid|dashed|dotted|none)$/,
      generate: (match) => `border-style: ${match[1]};`
    },
    {
      pattern: /^border-(.+)$/,
      generate: (match) => {
        const color = match[1];
        if (color.startsWith('#')) {
          return `border-color: ${color};`;
        }
        if (/^[a-zA-Z]+$/.test(color)) {
          return `border-color: ${color};`;
        }
        return `border-color: #${color};`;
      }
    },

    // Opacity 规则
    {
      pattern: /^opacity-(\d+)$/,
      generate: (match) => `opacity: ${parseInt(match[1]) / 100};`
    },

      // 颜色规则，例如: c-red => color: red
      // 颜色规则
      {
        pattern: /^(c|color|text)-(.+)$/,
        generate: (match) => {
          const color = match[2];
          if (color.startsWith('#')) {
            return `color: ${color};`;
          }
          if (/^[a-zA-Z]+$/.test(color)) {
            return `color: ${color};`;
          }
          return `color: #${color};`;
        }
      },
      
      // 背景颜色规则
      {
        pattern: /^(bg|background)-(.+)$/,
        generate: (match) => {
          const color = match[2];
          if (color.startsWith('#')) {
            return `background-color: ${color};`;
          }
          if (/^[a-zA-Z]+$/.test(color)) {
            return `background-color: ${color};`;
          }
          return `background-color: #${color};`;
        }
      },

    // Width & Height full 规则
    {
      pattern: /^w-full$/,
      generate: () => `width: 100%;`
    },
    {
      pattern: /^h-full$/,
      generate: () => `height: 100%;`
    },

    // Viewport width & height rules
    {
      pattern: /^w-screen$/,
      generate: () => `width: 100vw;`
    },
    {
      pattern: /^h-screen$/,
      generate: () => `height: 100vh;`
    },
    {
      pattern: /^min-w-screen$/,
      generate: () => `min-width: 100vw;`
    },
    {
      pattern: /^min-h-screen$/,
      generate: () => `min-height: 100vh;`
    },
    {
      pattern: /^max-w-screen$/,
      generate: () => `max-width: 100vw;`
    },
    {
      pattern: /^max-h-screen$/,
      generate: () => `max-height: 100vh;`
    },

    // Border radius full (圆形)
    {
      pattern: /^rounded-full$/,
      generate: () => `border-radius: 9999px;`
    },
    // Cursor 规则
    {
      pattern: /^cursor-(pointer|default|not-allowed|wait|text|move|grab)$/,
      generate: (match) => `cursor: ${match[1]};`
    },

    // Transform 规则
    {
      pattern: /^rotate-(\d+)$/,
      generate: (match) => `transform: rotate(${match[1]}deg);`
    },
    {
      pattern: /^scale-(\d+)$/,
      generate: (match) => `transform: scale(${match[1]});`
    },

    // Box-shadow 规则
    {
      pattern: /^shadow-(sm|md|lg|xl|none)$/,
      generate: (match) => {
        const shadows = {
          sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          none: 'none'
        };
        return `box-shadow: ${shadows[match[1]]};`;
      }
    },

    // Transition 规则
    {
      pattern: /^transition-(none|all|fast|slow)$/,
      generate: (match) => {
        const transitions = {
          none: 'none',
          all: 'all 0.3s ease',
          fast: 'all 0.15s ease',
          slow: 'all 0.5s ease'
        };
        return `transition: ${transitions[match[1]]};`;
      }
    },

    // 文本装饰
    {
      pattern: /^(underline|line-through|no-underline)$/,
      generate: (match) => `text-decoration: ${match[1] === 'no-underline' ? 'none' : match[1]};`
    },

    // 文本转换
    {
      pattern: /^(uppercase|lowercase|capitalize)$/,
      generate: (match) => `text-transform: ${match[1]};`
    },

    // White-space 规则
    {
      pattern: /^(whitespace|nowrap|pre|pre-line|pre-wrap)$/,
      generate: (match) => `white-space: ${match[1] === 'whitespace' ? 'normal' : match[1]};`
    },

    // Word-break 规则
    {
      pattern: /^break-(normal|words|all)$/,
      generate: (match) => `word-break: ${match[1]};`
    },

    // Pointer-events 规则
    {
      pattern: /^pointer-(events|none|auto)$/,
      generate: (match) => `pointer-events: ${match[1] === 'events' ? 'auto' : match[1]};`
    },

    // User-select 规则
    {
      pattern: /^select-(none|text|all|auto)$/,
      generate: (match) => `user-select: ${match[1]};`
    },

    // 滚动条行为
    {
      pattern: /^scroll-(auto|smooth)$/,
      generate: (match) => `scroll-behavior: ${match[1]};`
    },

    // 滚动条显示
    {
      pattern: /^scrollbar-(hide|show)$/,
      generate: (match) => match[1] === 'hide' ? 
        `::-webkit-scrollbar { display: none; } scrollbar-width: none;` :
        `scrollbar-width: auto;`
    },

    // ... 其他规则 ...
  ]
};

/**
 * 加载配置文件
 * @param {string} configPath - 配置文件路径
 * @returns {Object} 合并后的配置
 */
function loadConfig(configPath) {
  try {
    if (fs.existsSync(configPath)) {
      const userConfig = require(configPath);
      console.log(chalk.green('✓ 已加载配置文件:', configPath));
      
      // 合并配置
      const mergedConfig = {
        ...defaultConfig,
        ...userConfig,
        // 深度合并规则
        rules: [...(defaultConfig.rules || []), ...(userConfig.rules || [])]
      };
      
      return mergedConfig;
    } else {
      console.log(chalk.yellow('! 未找到配置文件，使用默认配置'));
      return defaultConfig;
    }
  } catch (error) {
    console.error(chalk.red('× 加载配置文件失败:'), error.message);
    console.log(chalk.yellow('! 使用默认配置'));
    return defaultConfig;
  }
}

module.exports = {
  defaultConfig,
  loadConfig
};