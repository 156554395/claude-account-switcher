// 添加账号命令 - 交互式

import { ConfigManager } from '../config/manager.js';
import { validateApiKey, validateAccountName, validateUrl } from '../utils/validator.js';
import { printError, printSuccess, printInfo } from '../utils/formatter.js';
import { DEFAULT_API_URL } from '../constants/defaults.js';
import { testAccount } from '../utils/api-tester.js';
import readline from 'readline';

/**
 * 创建命令行输入接口
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * 询问用户输入
 */
function askQuestion(rl, question, defaultValue = '') {
  return new Promise((resolve) => {
    const prompt = defaultValue
      ? `${question} [默认: ${defaultValue}]: `
      : `${question}: `;

    rl.question(prompt, (answer) => {
      if (!answer && defaultValue) {
        resolve(defaultValue);
      } else {
        resolve(answer);
      }
    });
  });
}

/**
 * 交互式添加账号
 * @param {string} name - 账号名称 (可选)
 */
export async function addAccount(name) {
  const configManager = new ConfigManager();
  const rl = createInterface();

  try {
    printInfo('=== 交互式添加 Claude 账号 ===\n');

    // 步骤 1: 账号名称
    let accountName = name;
    while (!accountName) {
      accountName = await askQuestion(rl, '请输入账号名称 (例如: personal, work)');
      if (!accountName) {
        printError('账号名称不能为空');
        continue;
      }
      if (!validateAccountName(accountName)) {
        printError('账号名称无效，只能包含字母、数字、下划线和连字符');
        accountName = '';
        continue;
      }
      const existing = configManager.findAccount(accountName);
      if (existing) {
        printError(`账号 '${accountName}' 已存在`);
        accountName = '';
      }
    }

    // 步骤 2: API Key
    let apiKey = '';
    while (!apiKey) {
      apiKey = await askQuestion(rl, '请输入 API Key');
      if (!apiKey) {
        printError('API Key 不能为空');
        continue;
      }
      if (!validateApiKey(apiKey)) {
        printError('API Key 格式无效，应该以 sk-ant- 开头');
        apiKey = '';
      }
    }

    // 步骤 3: API URL
    const url = await askQuestion(rl, '请输入 API 地址', DEFAULT_API_URL);
    if (url && !validateUrl(url)) {
      printError('API URL 格式无效');
      rl.close();
      process.exit(1);
    }

    // 步骤 4: 主模型
    const model = await askQuestion(rl, '请输入主模型 (可选，回车跳过)');

    // 步骤 5: 快速小模型
    const smallModel = await askQuestion(rl, '请输入快速小模型 (可选，回车跳过)');

    // 步骤 6: Opus 模型
    const opusModel = await askQuestion(rl, '请输入 Opus 模型 (可选，回车跳过)');

    // 步骤 7: 是否测试
    const testAnswer = await askQuestion(rl, '是否立即测试账号连通性? (yes/no)', 'no');
    const shouldTest = testAnswer.toLowerCase().startsWith('y');

    rl.close();

    // 创建账号对象
    const account = {
      name: accountName,
      key: apiKey,
      url: url
    };

    if (model) {
      account.model = model;
    }

    if (smallModel) {
      account.smallModel = smallModel;
    }

    if (opusModel) {
      account.opusModel = opusModel;
    }

    // 保存账号
    configManager.addAccount(account);
    printSuccess(`\n账号 '${accountName}' 添加成功！`);

    // 测试账号
    if (shouldTest) {
      console.log('\n测试账号连通性...');
      const result = await testAccount(account);

      if (result.success) {
        printSuccess(`API 测试通过 (${result.responseTime}ms)`);
      } else {
        printError(`API 测试失败: ${result.message}`);
      }
    }

    console.log('\n💡 提示: 使用 claude-account use ' + accountName + ' 切换到此账号');

  } catch (error) {
    rl.close();
    printError(`添加账号失败: ${error.message}`);
    process.exit(1);
  }
}
