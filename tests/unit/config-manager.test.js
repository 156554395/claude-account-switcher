// ConfigManager 测试文件

import { ConfigManager } from '../../src/config/manager.js';
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { strict as assert } from 'assert';

const TEST_DIR = join(homedir(), '.claude-test');
const TEST_SETTINGS = join(TEST_DIR, 'settings.json');

// 测试辅助函数
function setupTestEnv() {
  if (!existsSync(TEST_DIR)) {
    mkdirSync(TEST_DIR, { recursive: true, mode: 0o700 });
  }
}

function cleanupTestEnv() {
  if (existsSync(TEST_SETTINGS)) {
    unlinkSync(TEST_SETTINGS);
  }
  // 不删除目录，避免影响其他测试
}

// 测试 1: getCurrentEnvConfig - 正常情况
function testGetCurrentEnvConfigNormal() {
  console.log('测试 1: getCurrentEnvConfig - 正常情况');

  setupTestEnv();

  // 创建测试 settings.json
  const testSettings = {
    env: {
      ANTHROPIC_BASE_URL: "https://api.xiaomimimo.com/anthropic",
      ANTHROPIC_AUTH_TOKEN: "sk-test123",
      ANTHROPIC_DEFAULT_OPUS_MODEL: "mimo-v2-flash",
      ANTHROPIC_DEFAULT_SONNET_MODEL: "mimo-v2-flash",
      ANTHROPIC_DEFAULT_HAIKU_MODEL: "mimo-v2-flash",
      API_TIMEOUT_MS: "3000000"
    },
    permissions: { allow: ["Edit(*)"] }
  };

  writeFileSync(TEST_SETTINGS, JSON.stringify(testSettings, null, 2));

  // 创建临时的 ConfigManager 实例，使用测试路径
  const cm = new ConfigManager();
  const originalSettingsPath = cm.getSettingsPath;
  cm.getSettingsPath = () => TEST_SETTINGS;

  const result = cm.getCurrentEnvConfig();

  // 验证结果
  assert.ok(result, '应该返回 env 配置');
  assert.equal(result.ANTHROPIC_BASE_URL, "https://api.xiaomimimo.com/anthropic", '应该正确读取 BASE_URL');
  assert.equal(result.API_TIMEOUT_MS, "3000000", '应该正确读取 API_TIMEOUT_MS');

  // 恢复原始方法
  cm.getSettingsPath = originalSettingsPath;

  cleanupTestEnv();
  console.log('✅ 通过');
}

// 测试 2: getCurrentEnvConfig - 文件不存在
function testGetCurrentEnvConfigMissingFile() {
  console.log('测试 2: getCurrentEnvConfig - 文件不存在');

  cleanupTestEnv();

  const cm = new ConfigManager();
  const originalSettingsPath = cm.getSettingsPath;
  cm.getSettingsPath = () => TEST_SETTINGS;

  const result = cm.getCurrentEnvConfig();

  // 文件不存在时应该返回 null
  assert.equal(result, null, '文件不存在时应该返回 null');

  // 恢复原始方法
  cm.getSettingsPath = originalSettingsPath;

  console.log('✅ 通过');
}

// 测试 3: getCurrentEnvConfig - JSON 解析错误
function testGetCurrentEnvConfigInvalidJSON() {
  console.log('测试 3: getCurrentEnvConfig - JSON 解析错误');

  setupTestEnv();

  // 写入无效的 JSON
  writeFileSync(TEST_SETTINGS, '{ invalid json }');

  const cm = new ConfigManager();
  const originalSettingsPath = cm.getSettingsPath;
  cm.getSettingsPath = () => TEST_SETTINGS;

  const result = cm.getCurrentEnvConfig();

  // JSON 解析错误时应该返回 null
  assert.equal(result, null, 'JSON 解析错误时应该返回 null');

  // 恢复原始方法
  cm.getSettingsPath = originalSettingsPath;

  cleanupTestEnv();
  console.log('✅ 通过');
}

// 测试 4: clearEnvConfig - 正常情况
function testClearEnvConfigNormal() {
  console.log('测试 4: clearEnvConfig - 正常情况');

  setupTestEnv();

  // 创建测试 settings.json
  const testSettings = {
    env: {
      ANTHROPIC_BASE_URL: "https://api.xiaomimimo.com/anthropic",
      ANTHROPIC_AUTH_TOKEN: "sk-test123",
      API_TIMEOUT_MS: "3000000"
    },
    permissions: { allow: ["Edit(*)"] },
    features: { autoFormat: true }
  };

  writeFileSync(TEST_SETTINGS, JSON.stringify(testSettings, null, 2));

  const cm = new ConfigManager();
  const originalSettingsPath = cm.getSettingsPath;
  cm.getSettingsPath = () => TEST_SETTINGS;

  // 调用 clearEnvConfig
  const success = cm.clearEnvConfig();

  // 验证操作成功
  assert.equal(success, true, 'clearEnvConfig 应该返回 true');

  // 验证：env 应该被移除，但其他设置保留
  const data = readFileSync(TEST_SETTINGS, 'utf-8');
  const result = JSON.parse(data);

  assert.ok(!result.env, 'env 应该被移除');
  assert.ok(result.permissions, 'permissions 应该保留');
  assert.ok(result.features, 'features 应该保留');

  // 恢复原始方法
  cm.getSettingsPath = originalSettingsPath;

  cleanupTestEnv();
  console.log('✅ 通过');
}

// 测试 5: updateClaudeSettings - 只更新 env 配置
function testUpdateClaudeSettingsEnvOnly() {
  console.log('测试 5: updateClaudeSettings - 只更新 env 配置');

  setupTestEnv();

  // 创建现有的 settings.json，包含其他配置
  const existingSettings = {
    env: {
      ANTHROPIC_BASE_URL: "https://old-url.com",
      ANTHROPIC_AUTH_TOKEN: "sk-old",
      API_TIMEOUT_MS: "1000000"
    },
    permissions: { allow: ["Edit(*)"] },
    features: { autoFormat: true },
    hooks: { someHook: true }
  };

  writeFileSync(TEST_SETTINGS, JSON.stringify(existingSettings, null, 2));

  const cm = new ConfigManager();
  const originalSettingsPath = cm.getSettingsPath;
  cm.getSettingsPath = () => TEST_SETTINGS;

  // 测试账号数据
  const testAccount = {
    key: "sk-new123",
    url: "https://api.xiaomimimo.com/anthropic",
    model: "mimo-v2-flash",
    smallModel: "mimo-v2-flash"
  };

  // 调用 updateClaudeSettings
  cm.updateClaudeSettings(testAccount);

  // 验证：应该更新 env 配置，保留其他设置
  const data = readFileSync(TEST_SETTINGS, 'utf-8');
  const result = JSON.parse(data);

  assert.equal(result.env.ANTHROPIC_AUTH_TOKEN, "sk-new123", '应该更新 token');
  assert.equal(result.env.ANTHROPIC_BASE_URL, "https://api.xiaomimimo.com/anthropic", '应该更新 URL');
  assert.equal(result.env.API_TIMEOUT_MS, "3000000", 'API_TIMEOUT_MS 应该是固定的');
  assert.equal(result.env.ANTHROPIC_DEFAULT_SONNET_MODEL, "mimo-v2-flash", '应该设置 sonnet 模型');
  assert.equal(result.env.ANTHROPIC_DEFAULT_HAIKU_MODEL, "mimo-v2-flash", '应该设置 haiku 模型');
  assert.ok(result.permissions, 'permissions 应该保留');
  assert.ok(result.features, 'features 应该保留');
  assert.ok(result.hooks, 'hooks 应该保留');

  // 恢复原始方法
  cm.getSettingsPath = originalSettingsPath;

  cleanupTestEnv();
  console.log('✅ 通过');
}

// 运行所有测试
function runAllTests() {
  console.log('=== 开始 ConfigManager 测试 ===\n');

  try {
    testGetCurrentEnvConfigNormal();
    testGetCurrentEnvConfigMissingFile();
    testGetCurrentEnvConfigInvalidJSON();
    testClearEnvConfigNormal();
    testUpdateClaudeSettingsEnvOnly();

    console.log('\n🎉 所有测试通过！');
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { runAllTests };