// 显示当前账号命令

import { ConfigManager } from '../config/manager.js';
import { maskApiKey } from '../utils/validator.js';
import { printSeparator, printInfo } from '../utils/formatter.js';

/**
 * 显示当前账号
 */
export function showCurrentAccount() {
  const configManager = new ConfigManager();
  const currentName = configManager.getCurrentAccountName();

  if (!currentName) {
    printInfo('当前没有激活的账号');
    console.log('\n使用 "switch" 命令切换账号:');
    console.log('  eval $(node src/index.js switch <name>)');
    return;
  }

  const account = configManager.getCurrentAccount();
  if (!account) {
    printInfo('当前账号不存在,请重新切换');
    return;
  }

  console.log(`\n当前激活账号: ${account.name}`);
  printSeparator();
  console.log(`Key:        ${maskApiKey(account.key)}`);
  console.log(`URL:        ${account.url || '-'}`);
  console.log(`Model:      ${account.model || '-'}`);
  console.log(`Small:      ${account.smallModel || '-'}`);
  printSeparator();
  console.log();
}
