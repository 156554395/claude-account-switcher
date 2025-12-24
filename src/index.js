#!/usr/bin/env node

// Claude 账号切换工具 - CLI 入口文件

import { Command } from 'commander';
import { addAccount } from './commands/add.js';
import { listAccounts } from './commands/list.js';
import { switchAccount } from './commands/use.js';
import { removeAccount } from './commands/remove.js';
import { testAccountCommand } from './commands/test.js';
import { showCurrentAccount } from './commands/current.js';
import { clearEnvConfig } from './commands/clear.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 获取版本号从 package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJsonPath = join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
const version = packageJson.version;

const program = new Command();

program
  .name('claude-account')
  .description('Claude API 账号快速切换工具')
  .version(version);

// add 命令 - 添加账号 (交互式)
program
  .command('add [name]')
  .description('交互式添加新账号')
  .action(addAccount);

// list 命令 - 列出所有账号
program
  .command('list')
  .description('列出所有账号')
  .action(listAccounts);

// use 命令 - 切换账号
program
  .command('use <name>')
  .description('切换到指定账号')
  .action(switchAccount);

// remove 命令 - 删除账号
program
  .command('remove <name>')
  .description('删除指定账号')
  .option('-f, --force', '强制删除,不提示确认')
  .action(removeAccount);

// test 命令 - 测试账号
program
  .command('test [name]')
  .description('测试账号 API 连通性 (不指定则测试所有配置的模型)')
  .action(testAccountCommand);

// current 命令 - 显示当前账号信息
program
  .command('current')
  .description('显示当前账号信息 (读取 settings.json)')
  .action(showCurrentAccount);

// clear 命令 - 清空环境配置
program
  .command('clear')
  .description('清空 settings.json 中的环境配置')
  .action(clearEnvConfig);

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供任何命令,显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
