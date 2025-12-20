<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

Claude Account Switcher 是一个用于快速切换 Claude API 账号的 CLI 工具，支持多账号管理、API 测试、代理服务配置等功能。

## 开发环境

- **Node.js 版本**: >= 18.0.0
- **包管理器**: npm / pnpm / yarn
- **主要依赖**: commander (命令行参数解析)

## 常用命令

### 开发和测试

```bash
# 安装依赖
npm install

# 全局安装 (开发测试)
npm link

# 运行命令
claude-account <command>

# 示例命令
claude-account add
claude-account list
claude-account use personal
claude-account test
```

### 构建和发布

```bash
# 全局安装 (生产环境)
npm install -g .

# 或使用 pnpm
pnpm install -g .
```

## 代码架构

### 目录结构

```
src/
├── index.js                 # CLI 入口文件，使用 commander 定义命令
├── commands/               # 命令实现
│   ├── add.js              # 添加账号命令
│   ├── list.js             # 列出账号命令
│   ├── use.js              # 切换账号命令
│   ├── remove.js           # 删除账号命令
│   ├── test.js             # 测试账号命令
│   └── current.js          # 显示当前账号命令
├── config/                 # 配置管理
│   └── manager.js          # 配置文件读写和账号管理
├── utils/                  # 工具函数
│   ├── api-tester.js       # API 测试工具
│   ├── formatter.js        # 输出格式化
│   └── validator.js        # 参数验证
└── constants/              # 常量定义
    └── defaults.js         # 默认配置
```

### 核心组件

1. **CLI 入口 (src/index.js)**: 使用 commander 定义所有命令，处理命令行参数解析
2. **配置管理 (src/config/manager.js)**: 管理 `~/.claude/accounts.json` 配置文件，处理账号的增删改查
3. **命令实现**: 每个命令对应一个独立的模块，职责单一
4. **工具函数**: 提供通用的工具功能，如 API 测试、格式化输出等

### 数据存储

- 配置文件位置: `~/.claude/accounts.json`
- 文件权限: 600 (仅用户可读写)
- 存储格式: JSON，包含账号列表和当前选中账号

### 环境变量

切换账号时会设置以下环境变量：

- `ANTHROPIC_API_KEY`: API 密钥
- `ANTHROPIC_API_URL`: API 地址 (可选)
- `ANTHROPIC_MODEL`: 主模型 (可选)
- `ANTHROPIC_SMALL_FAST_MODEL`: 快速小模型 (可选)

## 开发注意事项

1. **安全性**: 配置文件使用 600 权限，API Key 显示时自动脱敏
2. **无副作用**: 切换账号只在当前终端会话有效，不修改系统配置文件
3. **命令设计**: 使用 `eval` 输出环境变量设置命令，需要用户在 shell 中执行
4. **代理支持**: 支持自定义 API URL，可用于代理服务或第三方服务

## 贡献指南

遵循标准的 git 工作流程：

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 创建 Pull Request

详见 [CONTRIBUTING.md](CONTRIBUTING.md) 文件。
