// 测试账号命令

import { ConfigManager } from '../config/manager.js';
import { testAccount } from '../utils/api-tester.js';
import { printError, printSuccess, printSeparator, printInfo } from '../utils/formatter.js';

/**
 * 测试账号
 * @param {string} name - 账号名称(可选,不指定则测试所有配置的模型)
 */
export async function testAccountCommand(name) {
  const configManager = new ConfigManager();

  // 如果没有指定账号名称,测试所有配置的模型（去重）
  if (!name) {
    const accounts = configManager.getAccounts();

    // 异常处理: 没有账号
    if (!accounts || accounts.length === 0) {
      printError('没有可测试的账号');
      console.log('\n提示: 请先使用 claude-account add 添加账号');
      process.exit(1);
    }

    // 收集所有需要测试的模型配置（去重）
    const modelTests = new Map(); // key: model|url, value: {model, url, accounts: []}

    for (const account of accounts) {
      const mainModel = account.model;
      const smallModel = account.smallModel;
      const opusModel = account.opusModel;
      const url = account.url || 'https://api.anthropic.com';

      // 收集所有模型
      const models = [mainModel, smallModel, opusModel].filter(m => m);

      for (const model of models) {
        const key = `${model}|${url}`;
        if (!modelTests.has(key)) {
          modelTests.set(key, {
            model,
            url,
            accounts: []
          });
        }
        modelTests.get(key).accounts.push(account.name);
      }
    }

    // 异常处理: 没有配置模型
    if (modelTests.size === 0) {
      printError('没有配置任何模型');
      console.log('\n提示: 请在添加账号时配置模型');
      process.exit(1);
    }

    console.log(`\n将测试所有配置的模型 (共 ${modelTests.size} 个)`);
    console.log('提示: 相同模型只测试一次，但会应用到所有相关账号');
    printSeparator(60);
    console.log();

    let allSuccess = true;
    let successCount = 0;
    let failCount = 0;

    // 遍历测试所有模型
    for (const [key, testInfo] of modelTests) {
      const { model, url, accounts } = testInfo;

      console.log(`测试模型: ${model}`);
      console.log(`  API 地址: ${url}`);
      // 去重显示账号名称（避免重复显示）
      const uniqueAccounts = [...new Set(accounts)];
      console.log(`  应用于账号: ${uniqueAccounts.join(', ')}`);

      // 创建临时账号对象用于测试
      const testAccountObj = {
        name: `model:${model}`,
        key: accounts.length > 0 ? configManager.findAccount(accounts[0]).key : '',
        url: url,
        model: model
      };

      try {
        const result = await testAccount(testAccountObj);

        if (result.success) {
          console.log(`  ✓ 成功 - 响应时间: ${result.responseTime}ms`);
          successCount++;
        } else {
          console.log(`  ✗ 失败 - ${result.message}`);
          if (result.status) {
            console.log(`    状态码: ${result.status}`);
          }
          failCount++;
          allSuccess = false;
        }
      } catch (error) {
        console.log(`  ✗ 异常 - ${error.message}`);
        failCount++;
        allSuccess = false;
      }

      console.log();
    }

    // 输出总结
    printSeparator(60);
    console.log(`\n测试结果: ${successCount} 成功, ${failCount} 失败`);

    if (allSuccess) {
      printSuccess('所有模型测试通过 ✓');
    } else {
      printError('部分模型测试失败 ✗');
      process.exit(1);
    }

    return;
  }

  // 指定了账号名称,只测试该账号
  const account = configManager.findAccount(name);

  // 异常处理: 账号不存在
  if (!account) {
    printError(`账号 '${name}' 不存在`);
    console.log('\n提示: 使用 claude-account list 查看所有账号');
    process.exit(1);
  }

  console.log(`\n测试账号: ${name}`);
  printSeparator(30);

  // 异常处理: 测试过程中的错误
  try {
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
  } catch (error) {
    printError(`测试过程中发生异常: ${error.message}`);
    console.log();
    printError('测试未通过 ✗');
    process.exit(1);
  }

  console.log();
}
