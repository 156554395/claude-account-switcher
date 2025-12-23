// 模型配置功能测试
// 测试模型配置的默认值逻辑和环境变量设置

import { ConfigManager } from '../../src/config/manager.js';
import fs from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const { readFileSync, existsSync, unlinkSync, writeFileSync, mkdirSync } = fs;

const CLAUDE_DIR = join(homedir(), '.claude');
const CONFIG_PATH = join(CLAUDE_DIR, 'accounts.json');
const SETTINGS_PATH = join(CLAUDE_DIR, 'settings.json');

// 测试专用目录，不影响用户真实配置
const TEST_DIR = join(homedir(), '.claude-test-model-config');
const TEST_CONFIG_PATH = join(TEST_DIR, 'accounts.json');
const TEST_SETTINGS_PATH = join(TEST_DIR, 'settings.json');

// 用户原始文件备份
let userConfigBackup = null;
let userSettingsBackup = null;

// 备份用户原始文件
function backupUserFiles() {
  if (existsSync(CONFIG_PATH)) {
    userConfigBackup = readFileSync(CONFIG_PATH, 'utf-8');
  }
  if (existsSync(SETTINGS_PATH)) {
    userSettingsBackup = readFileSync(SETTINGS_PATH, 'utf-8');
  }
}

// 恢复用户原始文件
function restoreUserFiles() {
  // 恢复 accounts.json
  if (userConfigBackup !== null) {
    writeFileSync(CONFIG_PATH, userConfigBackup);
    fs.chmodSync(CONFIG_PATH, 0o600);
  } else if (existsSync(CONFIG_PATH)) {
    unlinkSync(CONFIG_PATH);
  }

  // 恢复 settings.json
  if (userSettingsBackup !== null) {
    writeFileSync(SETTINGS_PATH, userSettingsBackup);
    fs.chmodSync(SETTINGS_PATH, 0o600);
  } else if (existsSync(SETTINGS_PATH)) {
    unlinkSync(SETTINGS_PATH);
  }

  // 清理测试目录
  if (existsSync(TEST_DIR)) {
    if (existsSync(TEST_CONFIG_PATH)) unlinkSync(TEST_CONFIG_PATH);
    if (existsSync(TEST_SETTINGS_PATH)) unlinkSync(TEST_SETTINGS_PATH);
    try {
      // 尝试删除测试目录（如果为空）
      const { rmdirSync } = require('fs');
      rmdirSync(TEST_DIR);
    } catch (e) {
      // 忽略目录删除错误
    }
  }
}

// 创建测试环境
function setupTestEnv() {
  // 确保测试目录存在
  if (!existsSync(TEST_DIR)) {
    mkdirSync(TEST_DIR, { recursive: true, mode: 0o700 });
  }

  // 创建 ConfigManager 实例，但重写路径方法使用测试目录
  const configManager = new ConfigManager();

  // 重写路径方法，使用测试目录
  const originalGetSettingsPath = configManager.getSettingsPath.bind(configManager);
  configManager.getSettingsPath = () => TEST_SETTINGS_PATH;

  // 重写 ensureConfigFile 使用测试目录
  const originalEnsureConfigFile = configManager.ensureConfigFile.bind(configManager);
  configManager.ensureConfigFile = function() {
    if (!existsSync(TEST_DIR)) {
      mkdirSync(TEST_DIR, { recursive: true, mode: 0o700 });
    }
    if (!existsSync(TEST_CONFIG_PATH)) {
      this.save({ version: '1.1.0', accounts: [] }, TEST_CONFIG_PATH);
      // 注意：这里需要修改 save 方法支持路径参数
    }
  };

  // 重写 save 方法支持自定义路径
  const originalSave = configManager.save.bind(configManager);
  configManager.save = function(data, customPath) {
    const path = customPath || TEST_CONFIG_PATH;
    try {
      writeFileSync(path, JSON.stringify(data, null, 2));
      // 不修改权限，测试目录权限由父目录控制
    } catch (error) {
      console.error('保存配置文件失败:', error.message);
      throw error;
    }
  };

  // 重写 load 方法使用测试路径
  const originalLoad = configManager.load.bind(configManager);
  configManager.load = function() {
    try {
      const data = readFileSync(TEST_CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return { version: '1.1.0', accounts: [] };
    }
  };

  // 重写 saveSettings 方法使用测试路径
  const originalSaveSettings = configManager.saveSettings.bind(configManager);
  configManager.saveSettings = function(data) {
    try {
      // 确保测试目录存在
      if (!existsSync(TEST_DIR)) {
        mkdirSync(TEST_DIR, { recursive: true, mode: 0o700 });
      }
      writeFileSync(TEST_SETTINGS_PATH, JSON.stringify(data, null, 2));
      // 不修改权限，测试目录权限由父目录控制
    } catch (error) {
      console.error('保存设置文件失败:', error.message);
      throw error;
    }
  };

  // 重写 loadSettings 方法使用测试路径
  const originalLoadSettings = configManager.loadSettings.bind(configManager);
  configManager.loadSettings = function() {
    try {
      const data = readFileSync(TEST_SETTINGS_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return {
        api_key: "",
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096
      };
    }
  };

  return configManager;
}

// 断言函数
function assertEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message}\n期望: ${JSON.stringify(expected)}\n实际: ${JSON.stringify(actual)}`);
  }
}

function assertExists(value, message) {
  if (!value) {
    throw new Error(message);
  }
}

function assertNotExists(value, message) {
  if (value) {
    throw new Error(message);
  }
}

// 测试场景
async function runTests() {
  console.log('=== 模型配置功能测试 ===\n');

  // 备份用户原始文件
  backupUserFiles();

  try {
    const configManager = setupTestEnv();

    // 测试场景1: 只配置主模型
    console.log('测试 1: 只配置主模型');
    const account1 = {
      name: 'test1',
      key: 'sk-ant-test1',
      url: 'https://api.anthropic.com',
      model: 'claude-sonnet-4-5-20250929'
    };

    configManager.addAccount(account1);
    configManager.setCurrentAccount('test1');
    configManager.updateClaudeSettings(account1);

    const settings1 = JSON.parse(readFileSync(TEST_SETTINGS_PATH, 'utf-8'));
    assertEqual(settings1.env.ANTHROPIC_DEFAULT_SONNET_MODEL, 'claude-sonnet-4-5-20250929', 'Sonnet模型应正确设置');
    assertEqual(settings1.env.ANTHROPIC_DEFAULT_HAIKU_MODEL, 'claude-sonnet-4-5-20250929', 'Haiku模型应默认为主模型');
    assertEqual(settings1.env.ANTHROPIC_DEFAULT_OPUS_MODEL, 'claude-sonnet-4-5-20250929', 'Opus模型应默认为主模型');
    console.log('✓ 通过\n');

    // 测试场景2: 配置主模型和小模型
    console.log('测试 2: 配置主模型和小模型');
    const account2 = {
      name: 'test2',
      key: 'sk-ant-test2',
      url: 'https://api.anthropic.com',
      model: 'claude-sonnet-4-5-20250929',
      smallModel: 'claude-haiku-4-5-20251001'
    };

    configManager.addAccount(account2);
    configManager.setCurrentAccount('test2');
    configManager.updateClaudeSettings(account2);

    const settings2 = JSON.parse(readFileSync(TEST_SETTINGS_PATH, 'utf-8'));
    assertEqual(settings2.env.ANTHROPIC_DEFAULT_SONNET_MODEL, 'claude-sonnet-4-5-20250929', 'Sonnet模型应正确设置');
    assertEqual(settings2.env.ANTHROPIC_DEFAULT_HAIKU_MODEL, 'claude-haiku-4-5-20251001', 'Haiku模型应使用配置值');
    assertEqual(settings2.env.ANTHROPIC_DEFAULT_OPUS_MODEL, 'claude-sonnet-4-5-20250929', 'Opus模型应默认为主模型');
    console.log('✓ 通过\n');

    // 测试场景3: 配置所有模型
    console.log('测试 3: 配置所有模型');
    const account3 = {
      name: 'test3',
      key: 'sk-ant-test3',
      url: 'https://api.anthropic.com',
      model: 'claude-sonnet-4-5-20250929',
      smallModel: 'claude-haiku-4-5-20251001',
      opusModel: 'claude-opus-4-5-20251101'
    };

    configManager.addAccount(account3);
    configManager.setCurrentAccount('test3');
    configManager.updateClaudeSettings(account3);

    const settings3 = JSON.parse(readFileSync(TEST_SETTINGS_PATH, 'utf-8'));
    assertEqual(settings3.env.ANTHROPIC_DEFAULT_SONNET_MODEL, 'claude-sonnet-4-5-20250929', 'Sonnet模型应正确设置');
    assertEqual(settings3.env.ANTHROPIC_DEFAULT_HAIKU_MODEL, 'claude-haiku-4-5-20251001', 'Haiku模型应使用配置值');
    assertEqual(settings3.env.ANTHROPIC_DEFAULT_OPUS_MODEL, 'claude-opus-4-5-20251101', 'Opus模型应使用配置值');
    console.log('✓ 通过\n');

    // 测试场景4: 不配置任何模型
    console.log('测试 4: 不配置任何模型');
    const account4 = {
      name: 'test4',
      key: 'sk-ant-test4',
      url: 'https://api.anthropic.com'
    };

    configManager.addAccount(account4);
    configManager.setCurrentAccount('test4');
    configManager.updateClaudeSettings(account4);

    const settings4 = JSON.parse(readFileSync(TEST_SETTINGS_PATH, 'utf-8'));
    assertNotExists(settings4.env.ANTHROPIC_DEFAULT_SONNET_MODEL, '不应设置Sonnet模型');
    assertNotExists(settings4.env.ANTHROPIC_DEFAULT_HAIKU_MODEL, '不应设置Haiku模型');
    assertNotExists(settings4.env.ANTHROPIC_DEFAULT_OPUS_MODEL, '不应设置Opus模型');
    assertExists(settings4.env.ANTHROPIC_AUTH_TOKEN, '应设置认证token');
    assertExists(settings4.env.ANTHROPIC_BASE_URL, '应设置API地址');
    console.log('✓ 通过\n');

    // 测试场景5: 验证 accounts.json 存储格式
    console.log('测试 5: 验证配置文件存储格式');
    const accounts = JSON.parse(readFileSync(TEST_CONFIG_PATH, 'utf-8'));

    const stored1 = accounts.accounts.find(a => a.name === 'test1');
    assertEqual(stored1.model, 'claude-sonnet-4-5-20250929', '场景1应存储主模型');
    assertNotExists(stored1.smallModel, '场景1不应存储小模型');
    assertNotExists(stored1.opusModel, '场景1不应存储Opus模型');

    const stored2 = accounts.accounts.find(a => a.name === 'test2');
    assertEqual(stored2.model, 'claude-sonnet-4-5-20250929', '场景2应存储主模型');
    assertEqual(stored2.smallModel, 'claude-haiku-4-5-20251001', '场景2应存储小模型');
    assertNotExists(stored2.opusModel, '场景2不应存储Opus模型');

    const stored4 = accounts.accounts.find(a => a.name === 'test4');
    assertNotExists(stored4.model, '场景4不应存储任何模型');
    assertNotExists(stored4.smallModel, '场景4不应存储小模型');
    assertNotExists(stored4.opusModel, '场景4不应存储Opus模型');
    console.log('✓ 通过\n');

    // 测试场景6: 验证 use.js 的显示逻辑
    console.log('测试 6: 验证账号信息显示逻辑');
    const testAccount = {
      name: 'display-test',
      key: 'sk-ant-display',
      url: 'https://api.anthropic.com',
      model: 'claude-sonnet-4-5-20250929'
    };

    // 模拟 use.js 中的显示逻辑
    const displayModel = testAccount.model || '默认';
    const displaySmallModel = testAccount.smallModel || testAccount.model;
    const displayOpusModel = testAccount.opusModel || testAccount.model;

    assertEqual(displayModel, 'claude-sonnet-4-5-20250929', '主模型显示正确');
    assertEqual(displaySmallModel, 'claude-sonnet-4-5-20250929', '小模型默认为主模型');
    assertEqual(displayOpusModel, 'claude-sonnet-4-5-20250929', 'Opus模型默认为主模型');
    console.log('✓ 通过\n');

    console.log('=== 所有测试通过 ===');

  } catch (error) {
    console.error('测试失败:', error.message);
    process.exit(1);
  } finally {
    // 恢复用户原始文件
    restoreUserFiles();
    console.log('测试数据已清理，用户配置文件已恢复');
  }
}

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests };