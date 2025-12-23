// 列出账号命令

import { ConfigManager } from '../config/manager.js';
import { maskApiKey } from '../utils/validator.js';
import { printSeparator, printInfo } from '../utils/formatter.js';

/**
 * 列出所有账号
 */
export function listAccounts() {
  const configManager = new ConfigManager();
  const accounts = configManager.getAccounts();
  const currentName = configManager.getCurrentAccountName();

  if (accounts.length === 0) {
    printInfo('还没有添加任何账号');
    console.log('\n使用 "add" 命令添加账号:');
    console.log('  node src/index.js add <name> <apiKey> [options]');
    return;
  }

  console.log('\n账号列表');
  printSeparator();
  console.log();

  accounts.forEach((account, index) => {
    const isCurrent = account.name === currentName;
    const prefix = isCurrent ? '→' : ' ';

    console.log(`${prefix} ${account.name}${isCurrent ? ' (当前)' : ''}`);
    console.log(`  Key:        ${maskApiKey(account.key)}`);
    console.log(`  URL:        ${account.url || '-'}`);
    console.log(`  主模型:      ${account.model || '-'}`);
    console.log(`  快速模型:    ${account.smallModel || '-'}`);
    console.log(`  Opus模型:    ${account.opusModel || '-'}`);

    // 不是最后一个账号时,添加空行
    if (index < accounts.length - 1) {
      console.log();
    }
  });

  console.log();
  printSeparator();
  console.log(`共 ${accounts.length} 个账号\n`);
}
