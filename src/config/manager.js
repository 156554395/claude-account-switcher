// 配置文件管理器

import { readFileSync, writeFileSync, existsSync, mkdirSync, chmodSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { DEFAULT_CONFIG } from '../constants/defaults.js';

const CLAUDE_DIR = join(homedir(), '.claude');
const CONFIG_PATH = join(CLAUDE_DIR, 'accounts.json');

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
}
