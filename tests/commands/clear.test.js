// clear 命令测试

import { describe, it, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { ConfigManager } from '../../src/config/manager.js';
import { clearEnvConfig } from '../../src/commands/clear.js';
import fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const CLAUDE_DIR = join(homedir(), '.claude');
const SETTINGS_PATH = join(CLAUDE_DIR, 'settings.json');
const BACKUP_DIR = CLAUDE_DIR;

describe('Clear Command', () => {
  let originalSettings = null;
  let backupFiles = [];

  beforeEach(() => {
    // 保存原始设置文件
    if (fs.existsSync(SETTINGS_PATH)) {
      originalSettings = fs.readFileSync(SETTINGS_PATH, 'utf-8');
    }

    // 清理所有现有备份文件，避免影响测试
    backupFiles = [];
    const existingBackups = fs.readdirSync(CLAUDE_DIR)
      .filter(file => file.startsWith('settings.backup.'));

    existingBackups.forEach(file => {
      const filePath = join(CLAUDE_DIR, file);
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // 忽略删除错误
      }
    });
  });

  afterEach(() => {
    // 恢复原始设置文件
    if (originalSettings) {
      fs.writeFileSync(SETTINGS_PATH, originalSettings);
      fs.chmodSync(SETTINGS_PATH, 0o600);
    } else if (fs.existsSync(SETTINGS_PATH)) {
      fs.unlinkSync(SETTINGS_PATH);
    }

    // 清理测试创建的所有备份文件
    const currentBackups = fs.readdirSync(CLAUDE_DIR)
      .filter(file => file.startsWith('settings.backup.'));

    currentBackups.forEach(file => {
      try {
        fs.unlinkSync(join(CLAUDE_DIR, file));
      } catch (e) {
        // 忽略删除错误
      }
    });
  });

  it('should clear env configuration successfully', () => {
    // 创建测试设置文件
    const testSettings = {
      api_key: "test-key",
      model: "test-model",
      env: {
        ANTHROPIC_AUTH_TOKEN: "sk-test-1234",
        ANTHROPIC_BASE_URL: "https://api.test.com",
        API_TIMEOUT_MS: "3000000"
      },
      permissions: { allow: ["Edit(*)"] }
    };

    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(testSettings, null, 2));
    fs.chmodSync(SETTINGS_PATH, 0o600);

    // 捕获 console.log 输出
    const originalLog = console.log;
    let logOutput = [];
    console.log = (...args) => logOutput.push(args.join(' '));

    try {
      clearEnvConfig();

      // 验证输出
      assert.ok(logOutput.some(msg => msg.includes('✅ 环境配置清除成功')));
      assert.ok(logOutput.some(msg => msg.includes('💡 使用 "claude-account use <name>" 重新配置')));

      // 验证文件内容
      const updatedSettings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
      assert.equal(updatedSettings.env, undefined);
      assert.equal(updatedSettings.api_key, "test-key");
      assert.equal(updatedSettings.model, "test-model");
      assert.deepEqual(updatedSettings.permissions, { allow: ["Edit(*)"] });

      // 验证备份文件创建
      const backups = fs.readdirSync(CLAUDE_DIR).filter(f => f.startsWith('settings.backup.'));
      assert.equal(backups.length, 1);

    } finally {
      console.log = originalLog;
    }
  });

  it('should handle missing env configuration gracefully', () => {
    // 创建没有 env 的设置文件
    const testSettings = {
      api_key: "test-key",
      model: "test-model",
      permissions: { allow: ["Edit(*)"] }
    };

    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(testSettings, null, 2));
    fs.chmodSync(SETTINGS_PATH, 0o600);

    // 捕获 console.log 输出
    const originalLog = console.log;
    let logOutput = [];
    console.log = (...args) => logOutput.push(args.join(' '));

    try {
      clearEnvConfig();

      // 验证输出
      assert.ok(logOutput.some(msg => msg.includes('ℹ️ 未找到环境配置，无需清除')));

      // 验证文件内容未改变
      const updatedSettings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
      assert.equal(updatedSettings.api_key, "test-key");
      assert.equal(updatedSettings.model, "test-model");

    } finally {
      console.log = originalLog;
    }
  });

  it('should handle missing settings.json gracefully', () => {
    // 确保设置文件不存在
    if (fs.existsSync(SETTINGS_PATH)) {
      fs.unlinkSync(SETTINGS_PATH);
    }

    // 捕获 console.log 输出
    const originalLog = console.log;
    let logOutput = [];
    console.log = (...args) => logOutput.push(args.join(' '));

    try {
      clearEnvConfig();

      // 验证输出
      assert.ok(logOutput.some(msg => msg.includes('ℹ️ 未找到环境配置，无需清除')));

    } finally {
      console.log = originalLog;
    }
  });

  it('should restore backup on error', () => {
    // 创建测试设置文件
    const testSettings = {
      api_key: "test-key",
      env: {
        ANTHROPIC_AUTH_TOKEN: "sk-test-1234"
      }
    };

    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(testSettings, null, 2));
    fs.chmodSync(SETTINGS_PATH, 0o600);

    // 捕获 console.error 输出
    const originalError = console.error;
    let errorOutput = [];
    console.error = (...args) => errorOutput.push(args.join(' '));

    // 模拟文件系统错误
    const originalWriteFileSync = fs.writeFileSync;
    fs.writeFileSync = () => { throw new Error('Test error'); };

    try {
      clearEnvConfig();

      // 验证错误处理
      assert.ok(errorOutput.some(msg => msg.includes('清除环境配置时出错')));

      // 验证备份被恢复
      const restoredSettings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
      assert.equal(restoredSettings.api_key, "test-key");
      assert.deepEqual(restoredSettings.env, { ANTHROPIC_AUTH_TOKEN: "sk-test-1234" });

    } finally {
      console.error = originalError;
      fs.writeFileSync = originalWriteFileSync;
    }
  });
});