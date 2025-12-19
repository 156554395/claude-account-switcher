# Project Context

## Purpose
Claude Account Switcher 是一个用于快速切换 Claude API 账号的 CLI 工具，支持多账号管理、API 测试、代理服务配置等功能。主要目标是提供一种简单、安全的方式来管理多个 Claude API 账号，并快速在不同账号之间切换，提高开发效率。

### 核心功能
- **多账号管理**: 添加、删除、列出多个 Claude API 账号
- **快速切换**: 3秒完成账号切换，无需手动修改环境变量
- **API 测试**: 验证账号有效性和可用性
- **代理支持**: 支持自定义 API URL，兼容代理服务
- **安全存储**: 配置文件使用 600 权限，API Key 自动脱敏
- **模型配置**: 支持为每个账号配置不同的模型

## Tech Stack

### 运行时环境
- **Node.js**: >= 18.0.0 (ES2022+ 支持)
- **包管理器**: pnpm (推荐) / npm / yarn
- **模块系统**: ES Modules (type: "module")

### 核心依赖
- **commander**: ^14.0.1 - 命令行参数解析框架
- **Node.js 内置模块**:
  - `fs/promises` - 异步文件操作
  - `path` - 路径处理
  - `os` - 操作系统信息
  - `process` - 进管理和环境变量

### 开发工具链
- **代码格式**: 标准 JavaScript/ES2022+ 风格
- **包发布**: npm registry
- **版本管理**: SemVer 规范
- **二进制分发**: npm bin 字段配置

## Project Conventions

### Code Style
- 使用 ES 模块 (import/export) 语法，而不是 CommonJS (require)
- 尽可能使用解构导入 (例如 import { foo } from 'bar')
- 代码格式化遵循标准的 JavaScript 风格
- 变量名使用驼峰命名法
- 命令函数使用动词开头

### Architecture Patterns

#### 目录结构设计
```
src/
├── index.js                 # CLI 入口，命令路由定义
├── commands/               # 命令实现层
│   ├── add.js              # 添加账号 (add)
│   ├── list.js             # 列出账号 (list)
│   ├── switch.js           # 切换账号 (use)
│   ├── remove.js           # 删除账号 (remove)
│   ├── test.js             # 测试 API (test)
│   └── current.js          # 显示当前账号 (current)
├── config/                 # 配置管理层
│   └── manager.js          # 配置文件 CRUD 和账号管理
├── utils/                  # 工具函数层
│   ├── api-tester.js       # API 测试和验证
│   ├── formatter.js        # 输出格式化和美化
│   └── validator.js        # 参数验证和类型检查
└── constants/              # 常量定义
    └── defaults.js         # 默认配置和常量
```

#### 设计原则
- **单一职责原则 (SRP)**: 每个模块只负责一个特定功能
- **开闭原则 (OCP)**: 易于扩展新命令，无需修改现有代码
- **依赖倒置**: 高层模块不依赖低层模块的具体实现
- **配置分离**: 配置管理与业务逻辑完全分离
- **无副作用**: CLI 工具不修改系统级配置

#### 命令实现模式
每个命令都遵循统一的实现模式：
```javascript
export async function handle(args) {
  // 1. 参数验证
  // 2. 配置读取/写入
  // 3. 业务逻辑处理
  // 4. 结果格式化输出
}
```

#### 数据流设计
1. **输入**: 命令行参数 → Commander 解析
2. **处理**: 命令模块 → Config Manager → 文件系统
3. **输出**: Formatter → Console 输出

#### 错误处理策略
- 使用 try/catch 处理同步错误
- 使用 async/await 处理异步错误
- 提供友好的错误提示信息
- 保持程序优雅退出

### Testing Strategy
- 单元测试覆盖核心功能
- 集成测试验证命令行交互
- API 测试验证账号有效性
- 优先运行单个测试，而不是整个测试套件

### Testing Strategy
- **单元测试**: 使用 Jest 或 Mocha 测试核心功能模块
- **集成测试**: 测试 CLI 命令的完整工作流
- **E2E 测试**: 测试真实的 API 调用和账号切换
- **测试优先级**: 单个测试 > 整个测试套件，提高开发效率

### Git Workflow
- **分支策略**:
  - `main`: 稳定分支，仅接受 release 和 hotfix
  - `develop`: 开发分支，集成新功能
  - `feature/*`: 功能分支，从 develop 创建
  - `hotfix/*`: 紧急修复，从 main 创建
- **提交规范**: 遵循 Conventional Commits
  - `feat`: 新功能
  - `fix`: 修复 bug
  - `refactor`: 代码重构
  - `docs`: 文档更新
  - `chore`: 构建或辅助工具变动
- **Code Review**: 所有 PR 必须经过审查才能合并

### 开发环境配置
```bash
# 安装依赖
pnpm install

# 开发模式（全局链接）
pnpm link

# 运行测试
pnpm test

# 代码检查
pnpm lint

# 构建项目
pnpm build
```

## Domain Context

### 业务领域
- **API 账号管理**: 多账号的生命周期管理
- **环境变量管理**: 安全的配置注入和切换
- **代理服务集成**: 支持第三方 API 代理
- **CLI 工具开发**: 命令行界面的最佳实践

### 目标用户
- 需要使用多个 Claude API 账号的开发者
- 需要在不同项目间切换 API 配置的团队
- 使用代理服务访问 Claude API 的用户
- 重视开发效率的技术人员

## Important Constraints

### 安全约束
- **文件权限**: 配置文件强制使用 600 权限
- **数据脱敏**: API Key 在日志和输出中自动隐藏
- **临时生效**: 账号切换仅影响当前终端会话
- **不存储敏感信息**: 不记录 API 调用历史

### 兼容性约束
- **Node.js 版本**: 最低支持 18.0.0
- **跨平台支持**: Linux、macOS、Windows
- **Shell 兼容**: Bash、Zsh、PowerShell（基本支持）

## External Dependencies

### 核心依赖
- **Anthropic Claude API**:
  - Endpoint: `https://api.anthropic.com`
  - Models: Claude-3.5-Sonnet, Claude-3-Opus, Claude-3-Haiku
  - Authentication: API Key (x-api-key header)

### 运行时依赖
- **Node.js**: JavaScript 运行环境
- **包管理器**: pnpm（推荐）/ npm / yarn
- **操作系统支持**:
  - Linux (Ubuntu 18.04+, CentOS 7+)
  - macOS (10.15+)
  - Windows (10+)

## Deployment & Distribution

### NPM 包发布
- **包名**: `claude-account-switcher`
- **版本管理**: 遵循 SemVer (Major.Minor.Patch)
- **发布流程**:
  1. 更新 version in package.json
  2. 生成 CHANGELOG.md
  3. 创建 git tag
  4. `npm publish`
- **安装方式**:
  ```bash
  # 全局安装
  npm install -g claude-account-switcher

  # 或使用 pnpm
  pnpm add -g claude-account-switcher
  ```

### 配置文件位置
- **默认路径**: `~/.claude/accounts.json`
- **Windows**: `%USERPROFILE%\.claude\accounts.json`
- **macOS**: `$HOME/.claude/accounts.json`
- **Linux**: `$HOME/.claude/accounts.json`

## Performance Considerations
- **启动速度**: 冷启动 < 500ms
- **文件 I/O**: 使用异步 API，避免阻塞
- **内存占用**: 运行时内存 < 50MB
- **并发安全**: 文件操作使用锁机制防止竞态
