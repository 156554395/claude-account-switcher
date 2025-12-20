// 切换账号命令 (use)

import { ConfigManager } from '../config/manager.js';
import { printError, printSuccess } from '../utils/formatter.js';

/**
 * 切换到指定账号
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

  try {
    // 更新 Claude 设置文件
    configManager.updateClaudeSettings(account);

    // 更新当前账号
    configManager.setCurrentAccount(name);

    // 输出成功信息
    printSuccess(`已切换到账号: ${name}`);
    console.log(`API 配置已更新到: ${configManager.getSettingsPath()}`);

    // 显示账号信息
    console.log('\n账号信息:');
    console.log(`  模型: ${account.model || '默认'}`);
    if (account.url) {
      console.log(`  API 地址: ${account.url}`);
    }
    // 如果没有配置小模型，使用主模型
    const smallModel = account.smallModel || account.model;
    if (smallModel) {
      console.log(`  快速模型: ${smallModel}`);
    }
    // 如果没有配置 Opus 模型，使用主模型
    const opusModel = account.opusModel || account.model;
    if (opusModel) {
      console.log(`  Opus 模型: ${opusModel}`);
    }

  } catch (error) {
    printError(`切换账号失败: ${error.message}`, { stderr: true });

    // 提供修复建议
    if (error.code === 'EACCES') {
      console.error('\n建议解决方案:');
      console.error('1. 检查 ~/.claude/ 目录的写入权限');
      console.error('2. 运行: chmod 700 ~/.claude');
      console.error('3. 运行: chmod 600 ~/.claude/settings.json');
    }

    process.exit(1);
  }
}
