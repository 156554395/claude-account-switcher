// 显示当前账号命令 (current)

import { ConfigManager } from '../config/manager.js';
import { printError, printInfo, printSuccess } from '../utils/formatter.js';
import fs from 'fs';

/**
 * 显示当前账号信息
 * 直接读取 settings.json 文件
 * 如果 settings.json 中有账号但 accounts.json 中没有，自动同步
 */
export function showCurrentAccount() {
  const configManager = new ConfigManager();
  const settingsPath = configManager.getSettingsPath();

  try {
    // 检查 settings.json 文件是否存在
    if (!fs.existsSync(settingsPath)) {
      printError('Claude settings.json 文件不存在');
      console.log(`路径: ${settingsPath}`);
      console.log('\n提示: 请先使用 claude-account add 添加账号');
      process.exit(1);
    }

    // 读取 settings.json
    const settingsContent = fs.readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(settingsContent);

    // 从 settings.json 中提取账号信息
    const apiKey = settings.env?.ANTHROPIC_AUTH_TOKEN;
    const apiUrl = settings.env?.ANTHROPIC_BASE_URL;
    const model = settings.env?.ANTHROPIC_DEFAULT_SONNET_MODEL || settings.env?.ANTHROPIC_DEFAULT_OPUS_MODEL;
    const smallModel = settings.env?.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    const opusModel = settings.env?.ANTHROPIC_DEFAULT_OPUS_MODEL;

    if (!apiKey) {
      printError('settings.json 中未找到 API Key');
      console.log('\n提示: 请先使用 claude-account add 添加账号');
      process.exit(1);
    }

    // 检查 accounts.json 中是否存在对应的账号
    const accounts = configManager.getAccounts();
    let matchedAccount = null;

    for (const account of accounts) {
      if (account.key === apiKey) {
        matchedAccount = account;
        break;
      }
    }

    // 如果 accounts.json 中没有，但 settings.json 中有，自动同步
    if (!matchedAccount) {
      printInfo('检测到 settings.json 中有账号信息，但 accounts.json 中不存在');
      console.log('正在自动同步...\n');

      // 生成账号名称（基于 URL 或使用默认名称）
      let accountName;
      if (apiUrl && apiUrl.includes('bigmodel')) {
        accountName = 'bigmodel';
      } else if (apiUrl && apiUrl.includes('xiaomi')) {
        accountName = 'xiaomi';
      } else if (apiUrl && apiUrl.includes('anthropic')) {
        accountName = 'official';
      } else {
        accountName = `account_${Date.now().toString().slice(-6)}`;
      }

      // 检查名称是否已存在
      const existingNames = accounts.map(a => a.name);
      let counter = 1;
      const baseName = accountName;
      while (existingNames.includes(accountName)) {
        accountName = `${baseName}_${counter}`;
        counter++;
      }

      // 创建新账号对象
      const newAccount = {
        name: accountName,
        key: apiKey,
        url: apiUrl || undefined,
        model: model || undefined,
        smallModel: smallModel || undefined,
        opusModel: opusModel || undefined
      };

      // 保存到 accounts.json
      configManager.addAccount(newAccount);
      configManager.setCurrentAccount(accountName);

      printSuccess(`已将 settings.json 中的账号同步到 accounts.json`);
      console.log(`账号名称: ${accountName}`);
      console.log('\n--- 当前账号信息 ---');
    } else {
      // 如果已存在，设置为当前账号
      configManager.setCurrentAccount(matchedAccount.name);
      printSuccess(`当前账号: ${matchedAccount.name}`);
      console.log('\n--- 账号详情 ---');
    }

    // 显示详细信息
    console.log(`API Key: ${maskApiKey(apiKey)}`);

    if (apiUrl) {
      console.log(`API 地址: ${apiUrl}`);
    }

    if (model) {
      console.log(`主模型: ${model}`);
    }

    if (smallModel) {
      console.log(`快速模型: ${smallModel}`);
    }

    if (opusModel) {
      console.log(`Opus 模型: ${opusModel}`);
    }

    console.log(`\n配置文件: ${settingsPath}`);

  } catch (error) {
    if (error.code === 'ENOENT') {
      printError(`文件不存在: ${error.message}`);
    } else if (error instanceof SyntaxError) {
      printError('settings.json 格式错误，无法解析');
      console.log(`错误: ${error.message}`);
    } else {
      printError(`读取配置失败: ${error.message}`);
    }
    process.exit(1);
  }
}

/**
 * API Key 脱敏显示
 */
function maskApiKey(key) {
  if (!key || key.length < 10) return key;

  // 如果是 sk-ant- 开头的格式
  if (key.startsWith('sk-ant-')) {
    const prefix = 'sk-ant-';
    const masked = '*'.repeat(Math.min(8, key.length - prefix.length - 4));
    const suffix = key.slice(-4);
    return `${prefix}${masked}${suffix}`;
  }

  // 其他格式
  const masked = '*'.repeat(Math.min(8, key.length - 4));
  const suffix = key.slice(-4);
  return `${masked}${suffix}`;
}
