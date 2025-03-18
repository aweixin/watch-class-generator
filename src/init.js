const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { defaultConfig } = require('./config');

/**
 * 初始化配置文件
 */
function init() {
  const configPath = path.resolve(process.cwd(), 'watch-class.config.js');
  
  // 检查配置文件是否已存在
  if (fs.existsSync(configPath)) {
    console.log(chalk.yellow('配置文件已存在，如需重新生成，请先删除现有配置文件。'));
    return;
  }
  
  // 生成配置文件内容
  const configContent = `module.exports = ${JSON.stringify(defaultConfig, null, 2)
    .replace(/"pattern": (\/\^.*?\\\/)/g, '"pattern": $1')
    .replace(/"generate": "(.*?)"/g, '"generate": $1')
    .replace(/"\$\{match\[1\]\}\$\{defaultConfig\.unit\};"/g, '`${match[1]}${defaultConfig.unit};`')
    .replace(/"\$\{match\[1\]\};"/g, '`${match[1]};`')
  }`;
  
  // 写入配置文件
  try {
    fs.writeFileSync(configPath, configContent);
    console.log(chalk.green('✓ 配置文件已生成:'), configPath);
    console.log(chalk.blue('提示: 您可以编辑此文件来自定义监听规则和输出设置。'));
  } catch (error) {
    console.error(chalk.red('× 生成配置文件失败:'), error.message);
  }
}

module.exports = init;