#!/usr/bin/env node

// Claude 账号切换工具 - CLI 入口文件

import { Command } from 'commander';
import { addAccount } from './commands/add.js';
import { listAccounts } from './commands/list.js';
import { switchAccount } from './commands/switch.js';
import { showCurrentAccount } from './commands/current.js';
import { removeAccount } from './commands/remove.js';
import { testAccountCommand } from './commands/test.js';

const program = new Command();

program
  .name('claude-account')
  .description('Claude API 账号快速切换工具')
  .version('1.1.0');

// add 命令 - 添加账号
program
  .command('add <name> <key>')
  .description('添加新账号')
  .option('-u, --url <url>', 'API 地址')
  .option('-m, --model <model>', '主模型')
  .option('-s, --small-model <model>', '快速小模型')
  .option('-t, --test', '添加后立即测试')
  .action(addAccount);

// list 命令 - 列出所有账号
program
  .command('list')
  .description('列出所有账号')
  .action(listAccounts);

// use 命令 - 切换账号
program
  .command('use <name>')
  .description('切换到指定账号 (输出 export 命令)')
  .action(switchAccount);

// switch 命令 - 兼容旧版本
program
  .command('switch <name>')
  .description('切换到指定账号 (输出 export 命令) [已弃用,请使用 use]')
  .action(switchAccount);

// current 命令 - 显示当前账号
program
  .command('current')
  .description('显示当前激活的账号')
  .action(showCurrentAccount);

// remove 命令 - 删除账号
program
  .command('remove <name>')
  .description('删除指定账号')
  .option('-f, --force', '强制删除,不提示确认')
  .action(removeAccount);

// test 命令 - 测试账号
program
  .command('test [name]')
  .description('测试账号 API 连通性 (不指定则测试当前账号)')
  .action(testAccountCommand);

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供任何命令,显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
