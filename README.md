# Claude Account Switcher

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

Claude API 账号快速切换工具

## 功能特性

- ✅ 管理多个 Claude API 账号配置
- ✅ 使用 `export` 方式快速切换账号(不修改系统配置)
- ✅ 支持自定义 API URL(代理/自建服务)
- ✅ 支持配置主模型和快速小模型
- ✅ API 连通性测试
- ✅ 配置文件安全存储在 `~/.claude/accounts.json`

## 安装

```bash
# 克隆项目
git clone https://github.com/156554395/claude-account-switcher.git
cd claude-account-switcher

# 安装依赖
pnpm install
```

## 使用方法

### 1. 添加账号

```bash
# 基础用法
node src/index.js add <name> <apiKey>

# 完整配置
node src/index.js add personal sk-ant-xxx \
  --url "https://api.anthropic.com" \
  --model "claude-sonnet-4-5-20250929" \
  --small-model "claude-3-5-haiku-20241022" \
  --test

# 选项说明
# -u, --url         API 地址(默认: https://api.anthropic.com)
# -m, --model       主模型
# -s, --small-model 快速小模型
# -t, --test        添加后立即测试
```

### 2. 列出所有账号

```bash
node src/index.js list
```

输出示例:
```
账号列表
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

→ personal (当前)
  Key:        sk-ant-xxx...xxx
  URL:        https://api.anthropic.com
  Model:      claude-sonnet-4-5-20250929
  Small:      claude-3-5-haiku-20241022

  work
  Key:        sk-ant-yyy...yyy
  URL:        https://api.anthropic.com
  Model:      -
  Small:      -

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
共 2 个账号
```

### 3. 切换账号

```bash
# 切换到指定账号
eval $(node src/index.js switch personal)

# 或创建别名(推荐)
alias claude-switch='eval $(node /path/to/src/index.js switch $1)'

# 使用别名切换
claude-switch personal
```

### 4. 查看当前账号

```bash
node src/index.js current
```

### 5. 测试账号

```bash
# 测试指定账号
node src/index.js test personal

# 测试当前账号
node src/index.js test
```

### 6. 删除账号

```bash
# 交互式删除
node src/index.js remove work

# 强制删除(不提示)
node src/index.js remove work --force
```

## 配置文件

配置文件存储在: `~/.claude/accounts.json`

文件格式:
```json
{
  "version": "1.0.0",
  "accounts": [
    {
      "name": "personal",
      "key": "sk-ant-xxx",
      "url": "https://api.anthropic.com",
      "model": "claude-sonnet-4-5-20250929",
      "smallModel": "claude-3-5-haiku-20241022"
    }
  ],
  "current": "personal"
}
```

### 字段说明

| 字段 | 必填 | 说明 | 默认值 |
|------|------|------|--------|
| name | ✓ | 账号别名 | - |
| key | ✓ | API Key | - |
| url | ✗ | API 地址 | https://api.anthropic.com |
| model | ✗ | 主模型 | - |
| smallModel | ✗ | 快速小模型 | - |

## 支持的环境变量

切换账号时会设置以下环境变量:

- `ANTHROPIC_API_KEY` - API 密钥(必需)
- `ANTHROPIC_API_URL` - API 地址(可选)
- `ANTHROPIC_MODEL` - 主模型(可选)
- `ANTHROPIC_SMALL_FAST_MODEL` - 快速小模型(可选)

## Shell 别名设置

添加到 `~/.bashrc` 或 `~/.zshrc`:

```bash
# Claude 账号切换工具别名
alias claude-add='node /path/to/src/index.js add'
alias claude-list='node /path/to/src/index.js list'
alias claude-switch='eval $(node /path/to/src/index.js switch $1)'
alias claude-test='node /path/to/src/index.js test'
alias claude-current='node /path/to/src/index.js current'
alias claude-remove='node /path/to/src/index.js remove'
```

使用别名:
```bash
claude-add personal sk-ant-xxx
claude-list
claude-switch personal
claude-current
claude-test
```

## 安全说明

1. 配置文件权限设置为 600(仅用户可读写)
2. API Key 在列表显示时会脱敏
3. 配置文件存储在用户目录 `~/.claude/`
4. 不建议将配置文件添加到版本控制

## 常见问题

### Q: 如何使用自定义代理?

```bash
node src/index.js add proxy sk-ant-xxx \
  --url "https://your-proxy.com/v1" \
  --model "qwen-plus" \
  --small-model "qwen-flash"
```

### Q: 切换账号后环境变量没有生效?

确保使用 `eval` 执行命令:
```bash
eval $(node src/index.js switch personal)
```

### Q: 如何验证账号是否可用?

```bash
node src/index.js test personal
```

## 开发

```bash
# 运行 CLI
node src/index.js [command]

# 查看帮助
node src/index.js --help
```

## 贡献

欢迎贡献! 请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

## 许可证

[MIT License](LICENSE) - 详见 LICENSE 文件

## Star History

如果这个项目对你有帮助,欢迎给个 ⭐️

## 相关项目

- [Claude Code](https://github.com/anthropics/claude-code) - Anthropic 官方 CLI 工具

## 支持

- 🐛 [报告 Bug](https://github.com/156554395/claude-account-switcher/issues)
- 💡 [功能建议](https://github.com/156554395/claude-account-switcher/issues)
- 💬 [讨论交流](https://github.com/156554395/claude-account-switcher/discussions)
