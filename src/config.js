const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const rules = require('./rules');

// 默认配置
const defaultConfig = {
  // 基础配置
  watchDirs: ['./src'],
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html','.wxml'],
  
  // 输出配置
  output: {
    dir: './src/styles',
    extension: '.css',
    fileName: 'generated',
    minify: false,
    sourceMap: false,
    autoPrefix: true,
    important: false,
    classPrefix: '',
     // 添加未处理的class注释配置
     unprocessedClasses: {
      enable: true,           // 是否启用未处理class注释
      position: 'top',        // 注释位置：'top' 或 'bottom'
      format: 'line'          // 注释格式：'line' (每行一个) 或 'inline' (单行)
    }
  },

  // 单位配置
  units: {
    default: 'px',
    spacing: 'px',    // margin, padding 等间距单位
    fontSize: 'px',   // 字体大小单位
    lineHeight: '',   // 行高单位（空为无单位数值）
    borderWidth: 'px' // 边框宽度单位
  },

  // 性能配置
  performance: {
    debounceTime: 300,
    cache: true,
    cacheFile: '.watch-class-cache'
  },

  // 日志配置
  logger: {
    level: 'info',    // debug, info, warn, error
    timestamp: true,
    saveToFile: false,
    logFile: './watch-class.log'
  },

  // 排除配置
  exclude: {
    patterns: ['node_modules/**', 'dist/**'],
    classNames: ['ant-', 'el-']
  },

  // 媒体查询配置
  mediaQueries: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // 主题配置
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    },
    spacing: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    borderRadius: {
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem'
    }
  },

  // 规则配置
  rules: rules
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
      
      // 深度合并配置
      const mergedConfig = {
        ...defaultConfig,
        ...userConfig,
        output: {
          ...defaultConfig.output,
          ...userConfig.output
        },
        units: {
          ...defaultConfig.units,
          ...(userConfig.units || {})
        },
        performance: {
          ...defaultConfig.performance,
          ...(userConfig.performance || {})
        },
        logger: {
          ...defaultConfig.logger,
          ...(userConfig.logger || {})
        },
        exclude: {
          ...defaultConfig.exclude,
          ...(userConfig.exclude || {})
        },
        mediaQueries: {
          ...defaultConfig.mediaQueries,
          ...(userConfig.mediaQueries || {})
        },
        theme: {
          ...defaultConfig.theme,
          ...(userConfig.theme || {}),
          colors: {
            ...defaultConfig.theme.colors,
            ...(userConfig.theme?.colors || {})
          },
          spacing: {
            ...defaultConfig.theme.spacing,
            ...(userConfig.theme?.spacing || {})
          },
          borderRadius: {
            ...defaultConfig.theme.borderRadius,
            ...(userConfig.theme?.borderRadius || {})
          }
        },
        rules: [...(defaultConfig.rules || []), ...(userConfig.rules || [])]
      };
      
      console.log(mergedConfig);
      
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