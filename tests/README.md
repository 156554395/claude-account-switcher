# 测试目录

本目录包含 `claude-account-switcher` 项目的单元测试。

## 目录结构

```
tests/
├── README.md              # 本文件
├── run_tests.js          # 测试运行器
├── commands/             # 命令测试
│   ├── clear.test.js    # clear 命令测试
│   └── ...              # 其他命令测试
└── unit/                 # 单元测试
    ├── model_config.test.js  # 模型配置测试
    └── config-manager.test.js # ConfigManager 测试
```

## 运行测试

### 运行所有测试
```bash
# 使用 Node.js 内置测试运行器
node --test tests/

# 或使用自定义测试运行器
node tests/run_tests.js
```

### 运行单个测试
```bash
# 模型配置测试
node tests/unit/model_config.test.js

# ConfigManager 测试
node tests/unit/config-manager.test.js

# Clear 命令测试
node tests/commands/clear.test.js
```

## 测试覆盖

### model_config.test.js
测试模型配置的默认值逻辑和环境变量设置：

- **测试 1**: 只配置主模型 → 其他模型默认为主模型
- **测试 2**: 配置主模型和小模型 → 小模型使用配置值，Opus默认为主模型
- **测试 3**: 配置所有模型 → 各模型使用配置值
- **测试 4**: 不配置任何模型 → 不添加模型环境变量
- **测试 5**: 验证 accounts.json 存储格式 → 只存储实际填写的字段
- **测试 6**: 验证 use.js 的显示逻辑 → 显示时使用默认值

### config-manager.test.js
测试 ConfigManager 类的核心方法：

- **测试 1**: getCurrentEnvConfig - 正常情况
- **测试 2**: getCurrentEnvConfig - 文件不存在
- **测试 3**: getCurrentEnvConfig - JSON 解析错误
- **测试 4**: clearEnvConfig - 正常情况
- **测试 5**: updateClaudeSettings - 只更新 env 配置

### clear.test.js
测试 clear 命令的完整功能：

- **测试 1**: 成功清除 env 配置
- **测试 2**: 处理缺少 env 配置的情况
- **测试 3**: 处理 settings.json 不存在的情况
- **测试 4**: 错误时自动恢复备份

## 测试原则

1. **独立性**: 每个测试独立运行，不依赖其他测试
2. **可恢复**: 测试前后会备份和恢复配置文件
3. **完整性**: 涵盖配置存储、环境变量设置、显示逻辑全流程
4. **安全性**: 测试使用独立的测试目录，不影响真实配置

## 环境要求

- Node.js >= 18.0.0
- 无需额外依赖，使用项目本身的 ConfigManager

## 测试最佳实践

### 运行测试前的准备

```bash
# 确保项目依赖已安装
npm install

# 如果使用了 npm link，建议先取消链接，避免测试时使用开发版本
npm unlink -g claude-account-switcher 2>/dev/null || true
```

### 调试失败的测试

```bash
# 查看详细错误信息
node tests/commands/clear.test.js 2>&1 | cat

# 或使用 Node.js 调试模式
node --inspect-brk tests/commands/clear.test.js
```

### 添加新测试

1. 在对应目录创建 `.test.js` 文件
2. 使用 Node.js 内置的 `node:test` 模块
3. 确保测试独立，不依赖外部状态
4. 测试前后清理临时文件

### 测试覆盖目标

- ✅ 核心功能 (ConfigManager)
- ✅ 命令逻辑 (add, list, use, remove, test, current, clear)
- ✅ 边界情况 (文件不存在、权限错误、JSON损坏)
- ✅ 安全特性 (文件权限、备份恢复)
- ⬜ 集成测试 (端到端流程)