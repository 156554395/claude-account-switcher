# Changelog

本项目的所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/),
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.1.0] - 2025-01-04

### 新增

- ✨ 新增 `use` 命令作为主要切换命令
  - 更符合直觉的命令名称
  - 保留 `switch` 命令向后兼容

### 改进

- 🔧 优化 API 认证方式
  - 官方 API 使用 `x-api-key` 头
  - 代理服务使用 `Authorization: Bearer` 头
  - 自动根据 API URL 选择正确的认证方式

### 文档

- 📝 更新所有文档中的命令示例
- 📝 更新别名配置说明

## [1.0.0] - 2025-01-02

### 新增

- ✨ 实现账号管理功能
  - `add` - 添加新账号
  - `list` - 列出所有账号
  - `remove` - 删除账号
  - `current` - 显示当前账号

- ✨ 实现账号切换功能
  - `switch` - 使用 export 方式切换账号
  - 支持配置 API URL
  - 支持配置主模型和快速小模型

- ✨ 实现 API 测试功能
  - `test` - 测试账号 API 连通性
  - 显示响应时间
  - 支持测试指定账号或当前账号

- 🔒 安全特性
  - 配置文件存储在 `~/.claude/accounts.json`
  - 文件权限设置为 600
  - API Key 脱敏显示

- 📝 完整文档
  - README.md 使用文档
  - CONTRIBUTING.md 贡献指南
  - LICENSE MIT 许可证
  - Issue 和 PR 模板

### 技术栈

- Node.js >= 18.0.0
- Commander.js 14.0.1
- ES 模块语法

[1.0.0]: https://github.com/156554395/claude-account-switcher/releases/tag/v1.0.0
