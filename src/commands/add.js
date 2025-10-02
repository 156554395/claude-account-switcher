// 添加账号命令

import { ConfigManager } from '../config/manager.js';
import { validateApiKey, validateAccountName, validateUrl } from '../utils/validator.js';
import { printError, printSuccess } from '../utils/formatter.js';
import { DEFAULT_API_URL } from '../constants/defaults.js';
import { testAccount } from '../utils/api-tester.js';

/**
 * 添加账号
 * @param {string} name - 账号名称
 * @param {string} key - API Key
 * @param {Object} options - 选项
 */
export async function addAccount(name, key, options) {
  const configManager = new ConfigManager();

  // 验证账号名称
  if (!validateAccountName(name)) {
    printError('账号名称无效,只能包含字母、数字、下划线和连字符');
    process.exit(1);
  }

  // 验证 API Key
  if (!validateApiKey(key)) {
    printError('API Key 格式无效,应该以 sk-ant- 开头');
    process.exit(1);
  }

  // 检查账号是否已存在
  const existingAccount = configManager.findAccount(name);
  if (existingAccount) {
    printError(`账号 '${name}' 已存在`);
    process.exit(1);
  }

  // 验证 URL (如果提供)
  const url = options.url || DEFAULT_API_URL;
  if (url && !validateUrl(url)) {
    printError('API URL 格式无效');
    process.exit(1);
  }

  // 创建账号对象
  const account = {
    name,
    key,
    url
  };

  // 添加可选字段
  if (options.model) {
    account.model = options.model;
  }

  if (options.smallModel) {
    account.smallModel = options.smallModel;
  }

  // 保存账号
  configManager.addAccount(account);
  printSuccess(`账号 '${name}' 添加成功`);

  // 如果指定了 --test 选项,测试账号
  if (options.test) {
    console.log('\n测试账号连通性...');
    const result = await testAccount(account);

    if (result.success) {
      printSuccess(`API 测试通过 (${result.responseTime}ms)`);
    } else {
      printError(`API 测试失败: ${result.message}`);
    }
  }
}
