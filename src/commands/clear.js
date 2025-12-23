// 清空环境配置命令

import { ConfigManager } from '../config/manager.js';
import { existsSync } from 'fs';

/**
 * 清空环境配置
 * 提供安全的方式来清除 settings.json 中的 env 配置
 */
export function clearEnvConfig() {
  const configManager = new ConfigManager();

  // 检查 settings.json 是否存在
  const settingsPath = configManager.getSettingsPath();

  if (!existsSync(settingsPath)) {
    console.log('ℹ️ 未找到环境配置，无需清除');
    return;
  }

  // 检查是否有 env 配置
  const currentEnv = configManager.getCurrentEnvConfig();
  if (!currentEnv) {
    console.log('ℹ️ 未找到环境配置，无需清除');
    return;
  }

  // 执行清除操作
  const success = configManager.clearEnvConfig();

  if (success) {
    console.log('✅ 环境配置清除成功');
    console.log('💡 使用 "claude-account use <name>" 重新配置');
  } else {
    console.log('❌ 清除环境配置失败');
  }
}