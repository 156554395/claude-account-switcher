// 配置文件管理器

import { readFileSync, writeFileSync, existsSync, mkdirSync, chmodSync, renameSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { DEFAULT_CONFIG } from '../constants/defaults.js';

const CLAUDE_DIR = join(homedir(), '.claude');
const CONFIG_PATH = join(CLAUDE_DIR, 'accounts.json');
const SETTINGS_PATH = join(CLAUDE_DIR, 'settings.json');

export class ConfigManager {
  constructor() {
    this.ensureConfigFile();
  }

  /**
   * 确保配置目录和文件存在
   */
  ensureConfigFile() {
    // 确保 ~/.claude 目录存在
    if (!existsSync(CLAUDE_DIR)) {
      mkdirSync(CLAUDE_DIR, { recursive: true, mode: 0o700 });
    }

    // 确保配置文件存在
    if (!existsSync(CONFIG_PATH)) {
      this.save(DEFAULT_CONFIG);
      chmodSync(CONFIG_PATH, 0o600);
    }
  }

  /**
   * 读取配置文件
   * @returns {Object} 配置对象
   */
  load() {
    try {
      const data = readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取配置文件失败:', error.message);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * 保存配置文件
   * @param {Object} data - 配置对象
   */
  save(data) {
    try {
      writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
      chmodSync(CONFIG_PATH, 0o600);
    } catch (error) {
      console.error('保存配置文件失败:', error.message);
      throw error;
    }
  }

  /**
   * 获取所有账号
   * @returns {Array} 账号列表
   */
  getAccounts() {
    const config = this.load();
    return config.accounts || [];
  }

  /**
   * 根据名称查找账号
   * @param {string} name - 账号名称
   * @returns {Object|null} 账号对象
   */
  findAccount(name) {
    const accounts = this.getAccounts();
    return accounts.find(acc => acc.name === name) || null;
  }

  /**
   * 添加账号
   * @param {Object} account - 账号对象
   */
  addAccount(account) {
    const config = this.load();
    config.accounts.push(account);
    this.save(config);
  }

  /**
   * 删除账号
   * @param {string} name - 账号名称
   */
  removeAccount(name) {
    const config = this.load();
    config.accounts = config.accounts.filter(acc => acc.name !== name);

    // 如果删除的是当前账号,清空 current
    if (config.current === name) {
      config.current = null;
    }

    this.save(config);
  }

  /**
   * 获取当前账号名称
   * @returns {string|null} 当前账号名称
   */
  getCurrentAccountName() {
    const config = this.load();
    return config.current;
  }

  /**
   * 获取当前账号
   * @returns {Object|null} 当前账号对象
   */
  getCurrentAccount() {
    const currentName = this.getCurrentAccountName();
    if (!currentName) return null;
    return this.findAccount(currentName);
  }

  /**
   * 设置当前账号
   * @param {string} name - 账号名称
   */
  setCurrentAccount(name) {
    const config = this.load();
    config.current = name;
    this.save(config);
  }

  /**
   * 获取 settings.json 文件路径
   * @returns {string} settings.json 文件路径
   */
  getSettingsPath() {
    return SETTINGS_PATH;
  }

  /**
   * 确保设置文件存在
   */
  ensureSettingsFile() {
    // 确保 ~/.claude 目录存在
    if (!existsSync(CLAUDE_DIR)) {
      mkdirSync(CLAUDE_DIR, { recursive: true, mode: 0o700 });
    }

    // 如果设置文件不存在，创建一个默认的
    if (!existsSync(SETTINGS_PATH)) {
      const defaultSettings = {
        api_key: "",
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096
      };
      this.saveSettings(defaultSettings);
    }
  }

  /**
   * 读取 Claude 设置文件
   * @returns {Object} 设置对象
   */
  loadSettings() {
    try {
      this.ensureSettingsFile();
      const settingsPath = this.getSettingsPath();
      const data = readFileSync(settingsPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取设置文件失败:', error.message);
      // 返回默认设置
      return {
        api_key: "",
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096
      };
    }
  }

  /**
   * 保存 Claude 设置文件
   * @param {Object} data - 设置对象
   */
  saveSettings(data) {
    try {
      const settingsPath = this.getSettingsPath();

      // 确保目录存在（不调用 ensureSettingsFile 避免循环）
      if (!existsSync(CLAUDE_DIR)) {
        mkdirSync(CLAUDE_DIR, { recursive: true, mode: 0o700 });
      }

      // 创建备份
      this.createSettingsBackup();

      writeFileSync(settingsPath, JSON.stringify(data, null, 2));
      chmodSync(settingsPath, 0o600);
    } catch (error) {
      console.error('保存设置文件失败:', error.message);
      // 尝试恢复备份
      this.restoreSettingsBackup();
      throw error;
    }
  }

  /**
   * 创建设置文件的备份
   */
  createSettingsBackup() {
    const settingsPath = this.getSettingsPath();
    if (existsSync(settingsPath)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = join(CLAUDE_DIR, `settings.backup.${timestamp}.json`);
      try {
        // 读取原文件内容
        const originalData = readFileSync(settingsPath, 'utf-8');
        // 写入备份文件
        writeFileSync(backupPath, originalData);
        chmodSync(backupPath, 0o600);
      } catch (error) {
        console.warn('创建设置文件备份失败:', error.message);
      }
    }
  }

  /**
   * 恢复设置文件的备份
   */
  restoreSettingsBackup() {
    try {
      const settingsPath = this.getSettingsPath();
      // 查找最新的备份文件
      const backupFiles = readdirSync(CLAUDE_DIR)
        .filter(file => file.startsWith('settings.backup.') && file.endsWith('.json'))
        .sort()
        .reverse();

      if (backupFiles.length > 0) {
        const latestBackup = join(CLAUDE_DIR, backupFiles[0]);
        const backupData = readFileSync(latestBackup, 'utf-8');
        writeFileSync(settingsPath, backupData);
        chmodSync(settingsPath, 0o600);
        console.log('已从备份恢复设置文件');
      }
    } catch (error) {
      console.warn('恢复设置文件备份失败:', error.message);
    }
  }


  /**
   * 验证设置文件结构
   * @param {Object} settings - 设置对象
   * @returns {boolean} 是否有效
   */
  validateSettings(settings) {
    if (!settings || typeof settings !== 'object') {
      return false;
    }

    // 至少应该有 api_key 字段
    return settings.hasOwnProperty('api_key');
  }

  /**
   * 获取当前环境配置
   * @returns {Object|null} env 配置对象，如果不存在返回 null
   */
  getCurrentEnvConfig() {
    try {
      const settingsPath = this.getSettingsPath();

      if (!existsSync(settingsPath)) {
        console.log('settings.json not found, using system environment variables');
        return null;
      }

      const data = readFileSync(settingsPath, 'utf-8');
      const settings = JSON.parse(data);

      if (!settings.env) {
        console.log('No env configuration found in settings.json');
        return null;
      }

      return settings.env;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('settings.json not found, using system environment variables');
        return null;
      }

      if (error instanceof SyntaxError) {
        console.log('settings.json is corrupted, please check the file');
        return null;
      }

      console.error('Error reading env configuration:', error.message);
      return null;
    }
  }

  /**
   * 清空环境配置
   * @returns {boolean} 是否成功
   */
  clearEnvConfig() {
    try {
      const settingsPath = this.getSettingsPath();

      if (!existsSync(settingsPath)) {
        console.log('settings.json not found, nothing to clear');
        return false;
      }

      // 创建备份
      this.createSettingsBackup();

      // 读取当前设置
      const data = readFileSync(settingsPath, 'utf-8');
      const settings = JSON.parse(data);

      // 移除 env 配置
      if (settings.env) {
        delete settings.env;
      }

      // 保存修改后的设置
      writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
      chmodSync(settingsPath, 0o600);

      console.log('Environment configuration cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing env configuration:', error.message);

      // 尝试恢复备份
      this.restoreSettingsBackup();
      return false;
    }
  }

  /**
   * 更新 Claude 设置中的 env 配置
   * @param {Object} account - 账号对象
   */
  updateClaudeSettings(account) {
    const settings = this.loadSettings();

    // 初始化 env 对象（如果不存在）
    if (!settings.env) {
      settings.env = {};
    }

    // 更新 env 配置，只更新指定的参数
    if (account.key) {
      settings.env.ANTHROPIC_AUTH_TOKEN = account.key;
    }

    if (account.url) {
      settings.env.ANTHROPIC_BASE_URL = account.url;
    }

    // 设置固定的 API_TIMEOUT_MS
    settings.env.API_TIMEOUT_MS = "3000000";

    // 清除旧的模型环境变量，避免残留
    delete settings.env.ANTHROPIC_DEFAULT_SONNET_MODEL;
    delete settings.env.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    delete settings.env.ANTHROPIC_DEFAULT_OPUS_MODEL;

    // 处理模型配置
    // 如果没有配置小模型和 Opus 模型，则使用主模型作为默认值
    const mainModel = account.model;
    const smallModel = account.smallModel || mainModel;
    const opusModel = account.opusModel || mainModel;

    if (mainModel) {
      // 根据账号的模型类型设置对应的 env 变量
      if (mainModel.includes('opus')) {
        settings.env.ANTHROPIC_DEFAULT_OPUS_MODEL = mainModel;
      } else if (mainModel.includes('sonnet')) {
        settings.env.ANTHROPIC_DEFAULT_SONNET_MODEL = mainModel;
      } else if (mainModel.includes('haiku')) {
        settings.env.ANTHROPIC_DEFAULT_HAIKU_MODEL = mainModel;
      } else {
        // 默认设置为 sonnet
        settings.env.ANTHROPIC_DEFAULT_SONNET_MODEL = mainModel;
      }
    }

    if (smallModel) {
      // 小模型通常设置为 haiku
      settings.env.ANTHROPIC_DEFAULT_HAIKU_MODEL = smallModel;
    }

    if (opusModel) {
      // Opus 模型
      settings.env.ANTHROPIC_DEFAULT_OPUS_MODEL = opusModel;
    }

    this.saveSettings(settings);
  }
}
