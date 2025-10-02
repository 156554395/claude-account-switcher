// 删除账号命令

import { ConfigManager } from '../config/manager.js';
import { printError, printSuccess, printWarning } from '../utils/formatter.js';
import * as readline from 'readline';

/**
 * 删除账号
 * @param {string} name - 账号名称
 * @param {Object} options - 选项
 */
export async function removeAccount(name, options) {
  const configManager = new ConfigManager();

  // 检查账号是否存在
  const account = configManager.findAccount(name);
  if (!account) {
    printError(`账号 '${name}' 不存在`);
    process.exit(1);
  }

  // 如果没有 --force 选项,询问确认
  if (!options.force) {
    const confirmed = await confirm(`确认删除账号 '${name}'?`);
    if (!confirmed) {
      console.log('已取消删除');
      return;
    }
  }

  // 如果删除的是当前账号,给出警告
  const currentName = configManager.getCurrentAccountName();
  if (currentName === name) {
    printWarning(`正在删除当前激活的账号 '${name}'`);
  }

  // 删除账号
  configManager.removeAccount(name);
  printSuccess(`账号 '${name}' 已删除`);
}

/**
 * 询问确认
 * @param {string} question - 问题
 * @returns {Promise<boolean>} 是否确认
 */
function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}
