// 切换账号命令

import { ConfigManager } from '../config/manager.js';
import { printError } from '../utils/formatter.js';

/**
 * 切换账号
 * @param {string} name - 账号名称
 */
export function switchAccount(name) {
  const configManager = new ConfigManager();

  // 查找账号
  const account = configManager.findAccount(name);
  if (!account) {
    printError(`账号 '${name}' 不存在`, { stderr: true });
    process.exit(1);
  }

  // 生成 export 命令
  const commands = [];

  // API Key (必需)
  commands.push(`export ANTHROPIC_API_KEY="${account.key}"`);

  // API URL (可选)
  if (account.url) {
    commands.push(`export ANTHROPIC_API_URL="${account.url}"`);
  }

  // 主模型 (可选)
  if (account.model) {
    commands.push(`export ANTHROPIC_MODEL="${account.model}"`);
  }

  // 快速小模型 (可选)
  if (account.smallModel) {
    commands.push(`export ANTHROPIC_SMALL_FAST_MODEL="${account.smallModel}"`);
  }

  // 更新当前账号
  configManager.setCurrentAccount(name);

  // 输出 export 命令 (供 eval 使用)
  console.log(commands.join('\n'));
}
