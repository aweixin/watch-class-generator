const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');

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
 * 根据规则生成CSS
 * @param {Set<string>} classes - class名称集合
 * @param {Array} rules - 规则配置
 * @returns {string} 生成的CSS内容
 */
function generateCSS(classes, rules) {
  let css = '/* 自动生成的样式文件 */\n';
  css += '/* 作者: 开黑店养只猫 */\n';
  css += '/* 项目: watch-class-generator */\n';
  css += '/* Github: https://github.com/xuzhixin/watch-class-generator */\n';
  css += '/* 生成时间: ' + new Date().toLocaleString() + ' */\n\n';
  
  const processedClasses = new Set();
  
  classes.forEach(className => {
    for (const rule of rules) {
      const match = className.match(rule.pattern);
      if (match) {
        const cssRule = rule.generate(match);
        css += `.${className} {\n  ${cssRule}\n}\n\n`;
        processedClasses.add(className);
        break;
      }
    }
  });
  
  // 记录未处理的class
  const unprocessedClasses = [...classes].filter(c => !processedClasses.has(c));
  if (unprocessedClasses.length > 0) {
    css += '/* 未匹配的class */\n';
    css += '/* ' + unprocessedClasses.join(', ') + ' */\n';
  }
  
  return css;
}

/**
 * 扫描文件并生成样式
 * @param {Object} config - 配置对象
 */
async function generateOnce(config) {
  console.log(chalk.blue('开始扫描文件...'));
  
  const allClasses = new Set();
  const filePatterns = [];
  
  // 构建文件匹配模式
  config.watchDirs.forEach(dir => {
    config.extensions.forEach(ext => {
      filePatterns.push(path.join(dir, `**/*${ext}`));
    });
  });
  
  // 扫描所有匹配的文件
  for (const pattern of filePatterns) {
    const files = await glob.glob(pattern);
    console.log(chalk.blue(`找到 ${files.length} 个文件匹配 ${pattern}`));
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const classes = extractClasses(content);
        classes.forEach(c => allClasses.add(c));
      } catch (error) {
        console.error(chalk.red(`处理文件 ${file} 时出错:`), error.message);
      }
    }
  }
  
  // 生成CSS
  const css = generateCSS(allClasses, config.rules);
  
  // 确保输出目录存在
  fs.ensureDirSync(config.outputDir);
  
  // 写入CSS文件
  const outputFile = path.join(config.outputDir, `generated${config.outputExtension}`);
  fs.writeFileSync(outputFile, css);
  
  console.log(chalk.green(`✓ 已生成样式文件: ${outputFile}`));
  console.log(chalk.green(`  - 共处理 ${allClasses.size} 个class`));
}

/**
 * 监听文件变化并生成样式
 * @param {Object} config - 配置对象
 */
function watchAndGenerate(config) {
  // 先生成一次
  generateOnce(config);
  
  // 构建监听模式
  const watchPatterns = [];
  config.watchDirs.forEach(dir => {
    config.extensions.forEach(ext => {
      watchPatterns.push(path.join(dir, `**/*${ext}`));
    });
  });
  
  console.log(chalk.blue('开始监听文件变化...'));
  console.log(chalk.blue(`监听模式: ${watchPatterns.join(', ')}`));
  
  // 启动监听
  const watcher = chokidar.watch(watchPatterns, {
    ignored: /(^|[\/\\])\../, // 忽略隐藏文件
    persistent: true
  });
  
  // 防抖处理，避免频繁生成
  let debounceTimer;
  const debouncedGenerate = () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      generateOnce(config);
    }, 300);
  };
  
  // 监听事件
  watcher
    .on('add', path => {
      console.log(chalk.blue(`文件添加: ${path}`));
      debouncedGenerate();
    })
    .on('change', path => {
      console.log(chalk.blue(`文件变化: ${path}`));
      debouncedGenerate();
    })
    .on('unlink', path => {
      console.log(chalk.yellow(`文件删除: ${path}`));
      debouncedGenerate();
    })
    .on('error', error => {
      console.error(chalk.red('监听错误:'), error);
    });
    
  console.log(chalk.green('✓ 监听已启动'));
  console.log(chalk.green('  按 Ctrl+C 停止监听'));
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