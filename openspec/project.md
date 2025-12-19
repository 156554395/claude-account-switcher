# Project Context

## Purpose
Claude Account Switcher 是一个用于快速切换 Claude API 账号的 CLI 工具，支持多账号管理、API 测试、代理服务配置等功能。主要目标是提供一种简单、安全的方式来管理多个 Claude API 账号，并快速在不同账号之间切换，提高开发效率。

## Tech Stack
- Node.js (>= 18.0.0)
- Commander (命令行参数解析)
- pnpm / npm / yarn (包管理器)
- ES 模块语法

## Project Conventions

### Code Style
- 使用 ES 模块 (import/export) 语法，而不是 CommonJS (require)
- 尽可能使用解构导入 (例如 import { foo } from 'bar')
- 代码格式化遵循标准的 JavaScript 风格
- 变量名使用驼峰命名法
- 命令函数使用动词开头

### Architecture Patterns
- 单一职责原则：每个命令模块独立负责一个功能
- 配置管理分离：配置文件读写与业务逻辑分离
- 工具函数复用：通用功能提取到 utils 目录
- 环境变量注入：通过 eval 输出环境变量设置命令

### Testing Strategy
- 单元测试覆盖核心功能
- 集成测试验证命令行交互
- API 测试验证账号有效性
- 优先运行单个测试，而不是整个测试套件

### Git Workflow
- 使用 feature 分支开发新功能
- 遵循标准的 git 工作流程
- 提交信息清晰描述变更内容
- 遵循 Conventional Commits 规范

## Domain Context
- Claude API 账号管理
- 环境变量配置
- 代理服务支持
- 命令行工具开发

## Important Constraints
- 配置文件使用 600 权限，仅用户可读写
- API Key 显示时自动脱敏
- 切换账号只在当前终端会话有效
- 支持自定义 API URL 用于代理服务

## External Dependencies
- Anthropic API ( Claude 官方 API )
- Node.js 运行时环境
- 包管理器 (pnpm/npm/yarn)
