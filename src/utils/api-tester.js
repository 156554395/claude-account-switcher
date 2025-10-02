// API 测试工具

/**
 * 测试账号的 API 连通性
 * @param {Object} account - 账号对象
 * @returns {Promise<Object>} 测试结果
 */
export async function testAccount(account) {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10秒超时

  try {
    const apiUrl = account.url || 'https://api.anthropic.com';
    const model = account.model || 'claude-3-5-sonnet-20241022';

    const response = await fetch(`${apiUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': account.key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }]
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        success: true,
        status: response.status,
        responseTime,
        message: 'API 测试通过'
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        status: response.status,
        responseTime,
        message: errorData.error?.message || `HTTP ${response.status}`,
        error: errorData
      };
    }
  } catch (error) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      return {
        success: false,
        message: '连接超时 (10秒)',
        error: error.message
      };
    }

    return {
      success: false,
      message: error.message || '未知错误',
      error: error.message
    };
  }
}
