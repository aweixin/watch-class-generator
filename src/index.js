const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

// 添加日志工具函数
function log(level, message, ...args) {
  const levels = {
    debug: { color: 'blue', prefix: '🔍' },
    info: { color: 'green', prefix: '✓' },
    warn: { color: 'yellow', prefix: '⚠' },
    error: { color: 'red', prefix: '×' }
  };

  const { color, prefix } = levels[level] || levels.info;
  console.log(chalk[color](`${prefix} ${message}`), ...args);
}

// 更新 generateCSS 函数
function generateCSS(classes, config) {
  const { output, theme, units } = config;
  const { minify, autoPrefix, important, classPrefix, unprocessedClasses } = output;
  
  const processedClasses = new Set();
  const mediaQueries = new Map();
  let cssRules = '';  // 用于存储生成的CSS规则

  // 先处理所有 class，收集已处理的类名
  classes.forEach(className => {
    if (config.exclude.classNames.some(prefix => className.startsWith(prefix))) {
      return;
    }

    // 处理响应式前缀
    let actualClassName = className;  // 直接使用原始类名
    let mediaQuery = null;
    
    // 检查是否包含媒体查询前缀
    Object.entries(config.mediaQueries).forEach(([breakpoint, value]) => {
      if (actualClassName.startsWith(`${breakpoint}:`)) {
        mediaQuery = value;
        actualClassName = actualClassName.slice(breakpoint.length + 1);
      }
    });

    // 移除这行，不再预处理负值
    // const normalizedClassName = className.replace(/--/g, '-');

    for (const rule of config.rules) {
      const match = actualClassName.match(rule.pattern);
      if (match) {
        const cssRule = rule.generate(match, config);
        const finalRule = important ? cssRule.replace(';', ' !important;') : cssRule;
        const finalClassName = classPrefix ? `${classPrefix}${actualClassName}` : actualClassName;

        if (mediaQuery) {
          if (!mediaQueries.has(mediaQuery)) {
            mediaQueries.set(mediaQuery, new Set());
          }
          mediaQueries.get(mediaQuery).add({
            className: finalClassName,
            rule: finalRule
          });
        } else {
          cssRules += minify ? 
            `.${finalClassName}{${finalRule}}` :
            `.${finalClassName} {\n  ${finalRule}\n}\n\n`;
        }
        
        processedClasses.add(className);
        break;
      }
    }
  });

  // 生成最终的 CSS 内容
  let css = '';
  
  // 添加未处理的 class 列表
  const unprocessedClassList = [...classes].filter(className => 
    !processedClasses.has(className) && 
    !config.exclude.classNames.some(prefix => className.startsWith(prefix)) &&
    !/[{}\[\]?]/.test(className)  // 过滤掉模板语法
  );

  if (unprocessedClassList.length > 0) {
    css += '/* 未处理的 class:\n';
    unprocessedClassList.forEach(className => {
      css += ` * - ${className}\n`;
    });
    css += ' */\n\n';
  }

  // 添加基本信息
  css += '/* 自动生成的样式文件 */\n';
  css += '/* 作者: xuzhixin */\n';
  css += '/* 项目: watch-class-generator */\n';
  css += '/* Github: https://github.com/xuzhixin/watch-class-generator */\n';
  css += '/* 生成时间: ' + new Date().toLocaleString() + ' */\n\n';

  // 添加CSS规则
  css += cssRules;

  // 添加媒体查询
  mediaQueries.forEach((styles, query) => {
    css += minify ?
      `@media(min-width:${query}){${[...styles].map(s => `.${s.className}{${s.rule}}`).join('')}}` :
      `@media (min-width: ${query}) {\n${[...styles].map(s => `  .${s.className} {\n    ${s.rule}\n  }`).join('\n')}\n}\n\n`;
  });

  // 添加媒体查询样式后，如果配置为底部显示未处理的class
  if (unprocessedClasses?.enable && unprocessedClasses.position === 'bottom') {
    const unprocessed = new Set([...classes].filter(className => 
      !processedClasses.has(className) && 
      !config.exclude.classNames.some(prefix => className.startsWith(prefix))
    ));
    log('warn', '未处理的 class:', [...unprocessed]);

    if (unprocessed.size > 0) {
      css += '\n/* 未处理的 class:\n';
      if (unprocessedClasses.format === 'line') {
        [...unprocessed].forEach(className => {
          css += ` * - ${className}\n`;
        });
      } else {
        css += ` * ${[...unprocessed].join(', ')}\n`;
      }
      css += ' */\n';
    }
  }

  const stats = getStyleStats(classes, processedClasses);
  printStyleStats(stats);

  return css;
}

// 更新 generateOnce 函数
async function generateOnce(config) {
  const { performance, logger, output } = config;
  
  if (logger.level === 'debug') {
    log('debug', '配置信息:', config);
  }

  log('info', '开始扫描文件...');
  
  const allClasses = new Set();
  const filePatterns = [];
  
  config.watchDirs.forEach(dir => {
    config.extensions.forEach(ext => {
      filePatterns.push(path.join(dir, `**/*${ext}`));
    });
  });

  for (const pattern of filePatterns) {
    const files = await glob.glob(pattern, { ignore: config.exclude.patterns });
    log('info', `找到 ${files.length} 个文件匹配 ${pattern}`);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const classes = extractClasses(content);
        classes.forEach(c => allClasses.add(c));
      } catch (error) {
        log('error', `处理文件 ${file} 时出错:`, error.message);
      }
    }
  }

  const css = generateCSS(allClasses, config);
  
  fs.ensureDirSync(output.dir);
  const outputFile = path.join(output.dir, `${output.fileName}${output.extension}`);
  fs.writeFileSync(outputFile, css);

  // 生成 sourcemap
  if (output.sourceMap) {
    const sourceMapContent = {
      version: 3,
      file: `${output.fileName}${output.extension}`,
      sources: ['source.css'],
      mappings: ''
    };
    fs.writeFileSync(`${outputFile}.map`, JSON.stringify(sourceMapContent));
  }

  // 移除这行，因为统计信息已经在 generateCSS 中处理了
  // const stats = getStyleStats(allClasses, processedClasses);
  // printStyleStats(stats);
}

// 更新 watchAndGenerate 函数
function watchAndGenerate(config) {
  generateOnce(config);
  
  const watchPatterns = [];
  config.watchDirs.forEach(dir => {
    config.extensions.forEach(ext => {
      watchPatterns.push(path.join(dir, `**/*${ext}`));
    });
  });
  
  log('info', '开始监听文件变化...');
  log('info', `监听模式: ${watchPatterns.join(', ')}`);
  
  const watcher = chokidar.watch(watchPatterns, {
    ignored: [...config.exclude.patterns, /(^|[\/\\])\../],
    persistent: true
  });
  
  let debounceTimer;
  const debouncedGenerate = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      generateOnce(config);
    }, config.performance.debounceTime);
  };
  
  watcher
    .on('add', path => {
      log('info', `文件添加: ${path}`);
      debouncedGenerate();
    })
    .on('change', path => {
      log('info', `文件变化: ${path}`);
      debouncedGenerate();
    })
    .on('unlink', path => {
      log('warn', `文件删除: ${path}`);
      debouncedGenerate();
    })
    .on('error', error => {
      log('error', '监听错误:', error);
    });
    
  log('info', '监听已启动');
  log('info', '按 Ctrl+C 停止监听');
}

/**
 * 从文件中提取class名称
 * @param {string} content - 文件内容
 * @returns {Set<string>} 提取到的class名称集合
 */
function extractClasses(content) {
  // 匹配class="xxx"或className="xxx"或class={'xxx'}等模式
  const classPatterns = [
    /class=["']([^"']+)["']/g,
    /className=["']([^"']+)["']/g,
    /class={["']([^"']+)["']}/g,
    /className={["']([^"']+)["']}/g,
    /class={`([^`]+)`}/g,
    /className={`([^`]+)`}/g
  ];

  const classes = new Set();
  
  classPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      // 分割多个class
      const classNames = match[1].split(/\s+/);
      classNames.forEach(className => {
        if (className.trim()) {
          classes.add(className.trim());
        }
      });
    }
  });
  
  return classes;
}

/**
 * 统计生成的样式信息
 * @param {Set<string>} allClasses - 所有class
 * @param {Set<string>} processedClasses - 已处理的class
 * @returns {Object} 统计信息
 */
function getStyleStats(allClasses, processedClasses) {
  return {
    total: allClasses.size,
    processed: processedClasses.size,
    unprocessed: allClasses.size - processedClasses.size,
    processedPercentage: Math.round((processedClasses.size / (allClasses.size || 1)) * 100)
  };
}

/**
 * 打印样式生成统计信息
 * @param {Object} stats - 统计信息
 */
function printStyleStats(stats) {
  console.log(chalk.green(`✓ 样式生成统计:`));
  console.log(chalk.green(`  - 总计: ${stats.total} 个class`));
  console.log(chalk.green(`  - 已处理: ${stats.processed} 个class (${stats.processedPercentage}%)`));
  
  if (stats.unprocessed > 0) {
    console.log(chalk.yellow(`  - 未处理: ${stats.unprocessed} 个class`));
  }
}

module.exports = {
  watchAndGenerate,
  generateOnce,
  extractClasses,
  generateCSS
};