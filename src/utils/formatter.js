// 输出格式化工具

/**
 * 打印分隔线
 * @param {number} length - 长度
 */
export function printSeparator(length = 60) {
  console.log('━'.repeat(length));
}

/**
 * 打印错误信息
 * @param {string} message - 错误消息
 */
export function printError(message) {
  console.error(`✗ 错误: ${message}`);
}

/**
 * 打印成功信息
 * @param {string} message - 成功消息
 */
export function printSuccess(message) {
  console.log(`✓ ${message}`);
}

/**
 * 打印警告信息
 * @param {string} message - 警告消息
 */
export function printWarning(message) {
  console.warn(`⚠ 警告: ${message}`);
}

/**
 * 打印信息
 * @param {string} message - 消息
 */
export function printInfo(message) {
  console.log(`ℹ ${message}`);
}
