// 数据验证工具

/**
 * 验证 API Key 格式
 * @param {string} key - API Key
 * @returns {boolean} 是否有效
 */
export function validateApiKey(key) {
  if (!key || typeof key !== 'string') {
    return false;
  }

  // API Key 应该以 sk-ant- 开头，或者长度足够长（支持测试环境的 key）
  return (key.startsWith('sk-ant-') || key.length > 20) && key.length > 10;
}

/**
 * 验证账号名称
 * @param {string} name - 账号名称
 * @returns {boolean} 是否有效
 */
export function validateAccountName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }

  // 账号名称只能包含字母、数字、下划线和连字符
  return /^[a-zA-Z0-9_-]+$/.test(name);
}

/**
 * 验证 URL 格式
 * @param {string} url - URL
 * @returns {boolean} 是否有效
 */
export function validateUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 脱敏显示 API Key
 * @param {string} key - API Key
 * @returns {string} 脱敏后的 Key
 */
export function maskApiKey(key) {
  if (!key || key.length < 12) {
    return '***';
  }

  return `${key.slice(0, 10)}...${key.slice(-4)}`;
}
