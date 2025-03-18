#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const { version } = require('../package.json');
const { watchAndGenerate, generateOnce } = require('../src/index');
const { loadConfig } = require('../src/config');

program
  .version(version)
  .description('监听前端文件中的class并自动生成对应的样式文件');

program
  .command('init')
  .description('初始化配置文件')
  .action(() => {
    require('../src/init')();
  });

program
  .command('watch')
  .description('监听文件变化并生成样式')
  .option('-c, --config <path>', '配置文件路径', 'watch-class.config.js')
  .action((options) => {
    const configPath = path.resolve(process.cwd(), options.config);
    const config = loadConfig(configPath);
    watchAndGenerate(config);
  });

program
  .command('generate')
  .description('生成样式文件（不监听）')
  .option('-c, --config <path>', '配置文件路径', 'watch-class.config.js')
  .action((options) => {
    const configPath = path.resolve(process.cwd(), options.config);
    const config = loadConfig(configPath);
    generateOnce(config);
  });

program.parse(process.argv);

// 如果没有提供命令，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}