// 测试账号命令

import { ConfigManager } from '../config/manager.js';
import { testAccount } from '../utils/api-tester.js';
import { printError, printSuccess, printSeparator } from '../utils/formatter.js';

/**
 * 测试账号
 * @param {string} name - 账号名称(可选,默认测试当前账号)
 */
export async function testAccountCommand(name) {
  const configManager = new ConfigManager();

  // 如果没有指定账号名称,测试当前账号
  if (!name) {
    name = configManager.getCurrentAccountName();
    if (!name) {
      printError('当前没有激活的账号,请指定要测试的账号名称');
      process.exit(1);
    }
  }

  // 查找账号
  const account = configManager.findAccount(name);
  if (!account) {
    printError(`账号 '${name}' 不存在`);
    process.exit(1);
  }

  console.log(`\n测试账号: ${name}`);
  printSeparator(30);

  // 执行测试
  const result = await testAccount(account);

  if (result.success) {
    printSuccess('API 连接成功');
    printSuccess('API Key 有效');

    if (account.model) {
      printSuccess(`模型可用 (${account.model})`);
    }

    console.log(`⏱  响应时间: ${result.responseTime}ms`);
    console.log();
    printSuccess('测试通过 ✓');
  } else {
    printError(`测试失败: ${result.message}`);

    if (result.status) {
      console.log(`   HTTP 状态: ${result.status}`);
    }

    console.log();
    printError('测试未通过 ✗');
    process.exit(1);
  }

  console.log();
}
