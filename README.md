# Claude Account Switcher

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

**🚀 快速切换 Claude API 账号，提升开发效率**

一个用于管理多个 Claude API 账号的 CLI 工具，支持账号切换、API 测试、代理配置等功能。

---

## 📦 安装

```bash
# 使用 npm
npm install -g claude-account-switcher@latest

# 或使用 pnpm
pnpm install -g claude-account-switcher@latest

```

## 直接运行
```bash
npx claude-account-switcher@latest 
```

---

## 🎯 快速开始

### 1. 添加账号

```bash
# 交互式添加（推荐）
claude-account add

# 或预先指定账号名
claude-account add personal
```

添加过程中会依次询问：

- 账号名称（如果未预先指定）
- API Key（必须）
- API 地址（可选，默认：https://api.anthropic.com）
- 主模型（可选）
- 快速小模型（可选）
- Opus 模型（可选）
- 是否立即测试连通性

**模型配置说明：**

- 所有模型字段都是可选的，如果不配置可以回车跳过
- 如果填写了主模型，后续模型未填写时会自动使用主模型的值
- 只有实际填写的模型才会保存到配置文件中
- 未填写的模型字段不会出现在 `~/.claude/accounts.json` 中

### 2. 切换账号

```bash
claude-account use personal
```

### 3. 查看当前账号

```bash
claude-account current
```

---

## 📋 所有命令

| 命令      | 说明           | 示例                                                  |
| --------- | -------------- | ----------------------------------------------------- |
| `add`     | 添加新账号     | `claude-account add` 或 `claude-account add personal` |
| `list`    | 列出所有账号   | `claude-account list`                                 |
| `use`     | 切换账号       | `claude-account use personal`                         |
| `test`    | 测试账号连通性 | `claude-account test personal`                        |
| `remove`  | 删除账号       | `claude-account remove work`                          |
| `current` | 查看当前账号   | `claude-account current`                              |
| `clear`   | 清空环境配置   | `claude-account clear`                                |

---

## 🔧 详细使用

### 添加账号

**交互式添加（唯一方式）：**

```bash
# 完全交互式
claude-account add

# 预先指定账号名称
claude-account add personal
```

**添加过程会依次询问：**

1. **账号名称**（如果未预先指定）
2. **API Key**（必须，格式：`sk-ant-xxx`）
3. **API 地址**（可选，默认：`https://api.anthropic.com`）
4. **主模型**（可选，例如：`claude-sonnet-4-5-20250929`）
5. **快速小模型**（可选，例如：`claude-haiku-4-5-20251001`）
6. **Opus 模型**（可选，例如：`claude-opus-4-5-20251101`）
7. **是否立即测试连通性**（yes/no）

**示例 1：完整配置**

```bash
$ claude-account add personal
=== 交互式添加 Claude 账号 ===

请输入账号名称 (例如: personal, work): personal
请输入 API Key: sk-ant-xxx
请输入 API 地址 [默认: https://api.anthropic.com]:
请输入主模型 (可选，回车跳过): claude-sonnet-4-5-20250929
请输入快速小模型 (可选，回车跳过): claude-haiku-4-5-20251001
请输入 Opus 模型 (可选，回车跳过): claude-opus-4-5-20251101
是否立即测试账号连通性? (yes/no) [默认: no]: yes

账号 'personal' 添加成功！
API 测试通过 (456ms)
💡 提示: 使用 claude-account use personal 切换到此账号
```

**示例 2：只配置主模型（后续模型自动使用主模型）**

```bash
$ claude-account add work
=== 交互式添加 Claude 账号 ===

请输入账号名称 (例如: personal, work): work
请输入 API Key: sk-ant-yyy
请输入 API 地址 [默认: https://api.anthropic.com]:
请输入主模型 (可选，回车跳过): claude-sonnet-4-5-20250929
请输入快速小模型 (可选，回车跳过):
请输入 Opus 模型 (可选，回车跳过):

账号 'work' 添加成功！
💡 提示: 使用 claude-account use work 切换到此账号
```

此时配置文件只保存：`model: "claude-sonnet-4-5-20250929"`，不包含 `smallModel` 和 `opusModel` 字段。

**示例 3：不配置任何模型**

```bash
$ claude-account add test
=== 交互式添加 Claude 账号 ===

请输入账号名称 (例如: personal, work): test
请输入 API Key: sk-ant-zzz
请输入 API 地址 [默认: https://api.anthropic.com]:
请输入主模型 (可选，回车跳过):
请输入快速小模型 (可选，回车跳过):
请输入 Opus 模型 (可选，回车跳过):

账号 'test' 添加成功！
💡 提示: 使用 claude-account use test 切换到此账号
```

此时配置文件不包含任何模型字段。

### 切换账号

```bash
# 切换到指定账号
claude-account use personal

# 切换后会自动更新 ~/.claude/settings.json
# 配置立即生效，无需重载 shell
```

### 测试账号

```bash
# 测试指定账号
claude-account test personal

# 测试当前账号
claude-account test

# 测试所有账号（去重测试所有配置的模型）
claude-account test
```

### 管理账号

```bash
# 列出所有账号
claude-account list

# 查看当前账号
claude-account current

# 删除账号（交互式）
claude-account remove work

# 强制删除
claude-account remove work --force

# 清空环境配置（保留其他设置）
claude-account clear
```

### 清空环境配置

`clear` 命令用于安全地清除 `~/.claude/settings.json` 中的 `env` 配置，同时保留其他设置：

```bash
$ claude-account clear
✅ 环境配置清除成功
💡 使用 "claude-account use <name>" 重新配置
```

**使用场景：**

- 需要重置 API 密钥和代理配置
- 切换到不同的账号系统
- 清理敏感的环境变量

**注意事项：**

- 只删除 `env` 配置，保留 `api_key`、`model`、`max_tokens` 等其他设置
- 自动创建备份文件（`settings.backup.{timestamp}.json`）
- 如果清除失败，会自动恢复备份
- 无法删除文件时会提示错误信息

---

## 🔧 配置文件

### 存储位置

- **账号配置：** `~/.claude/accounts.json`
- **Claude 配置：** `~/.claude/settings.json`

### 配置格式

配置文件只保存实际填写的字段：

**示例 1：配置了所有模型**

```json
{
  "version": "1.1.0",
  "accounts": [
    {
      "name": "personal",
      "key": "sk-ant-xxx",
      "url": "https://api.anthropic.com",
      "model": "claude-sonnet-4-5-20250929",
      "smallModel": "claude-haiku-4-5-20251001",
      "opusModel": "claude-opus-4-5-20251101"
    }
  ]
}
```

**示例 2：只配置了主模型**

```json
{
  "version": "1.1.0",
  "accounts": [
    {
      "name": "personal",
      "key": "sk-ant-xxx",
      "url": "https://api.anthropic.com",
      "model": "claude-sonnet-4-5-20250929"
    }
  ]
}
```

**示例 3：未配置任何模型**

```json
{
  "version": "1.1.0",
  "accounts": [
    {
      "name": "personal",
      "key": "sk-ant-xxx",
      "url": "https://api.anthropic.com"
    }
  ]
}
```

---

## 🔒 安全特性

- ✅ **文件权限 600** - 仅用户可读写
- ✅ **API Key 脱敏** - 显示时自动隐藏
- ✅ **本地存储** - 不上传云端
- ✅ **开源可审计** - 代码透明

---

## 💡 使用技巧

### 多账号场景

```bash
# 个人项目
claude-account use personal

# 工作项目
claude-account use work

# 客户项目
claude-account use client-a
```

### 代理配置

如果需要使用代理服务（如阿里云 DashScope、OpenAI 兼容服务等），在添加账号时：

1. 在询问 API 地址时输入代理地址：`https://dashscope.aliyuncs.com`
2. 在询问模型时输入兼容模型：`qwen-plus`

```bash
$ claude-account add proxy
=== 交互式添加 Claude 账号 ===

请输入账号名称 (例如: personal, work): proxy
请输入 API Key: sk-xxx
请输入 API 地址 [默认: https://api.anthropic.com]: https://dashscope.aliyuncs.com
请输入主模型 (可选，回车跳过): qwen-plus
请输入快速小模型 (可选，回车跳过): qwen-turbo
请输入 Opus 模型 (可选，回车跳过):
是否立即测试账号连通性? (yes/no) [默认: no]: yes

账号 'proxy' 添加成功！
API 测试通过 (321ms)
💡 提示: 使用 claude-account use proxy 切换到此账号
```

配置文件将只保存实际填写的字段：

```json
{
  "name": "proxy",
  "key": "sk-xxx",
  "url": "https://dashscope.aliyuncs.com",
  "model": "qwen-plus",
  "smallModel": "qwen-turbo"
}
```

---

## ❓ 常见问题

**Q: 切换后配置没有生效？**
A: 配置会自动更新 `~/.claude/settings.json`，立即生效。

**Q: 如何验证账号是否可用？**
A: 使用 `claude-account test [账号名]` 测试连通性。

**Q: 支持哪些模型？**
A: 支持所有 Claude 模型和兼容模型（如 qwen-plus 等）。

**Q: 配置文件在哪里？**
A: 账号列表在 `~/.claude/accounts.json`，Claude 配置在 `~/.claude/settings.json`。

---

## 🤝 贡献

欢迎提交 Issue、功能建议或 Pull Request！

- **Issue:** https://github.com/156554395/claude-account-switcher/issues
- **PR:** https://github.com/156554395/claude-account-switcher/pulls

### 🚀 自动发布流程

本项目配置了 GitHub Actions 自动发布到 NPM：

1. **创建 Release**: 在 GitHub 上创建新的 Release（如 `v1.1.2`）
2. **自动测试**: GitHub Actions 会自动运行测试
3. **自动发布**: 测试通过后自动发布到 NPM
4. **查看状态**: 在 GitHub Actions 页面查看发布状态

**⚠️ 重要**: 由于 npm 2024年12月的 MFA 要求，必须先启用多因素认证才能设置自动发布。

**配置指南**: 查看 [`.github/NPM_SETUP.md`](.github/NPM_SETUP.md) 了解详细步骤。

---

## 📄 开源协议

[MIT License](LICENSE) - 自由使用、修改、分发
