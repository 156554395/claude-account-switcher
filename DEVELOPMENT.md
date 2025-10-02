# 开发文档

本文档面向想要参与项目开发或从源码运行的开发者。

如果你是普通用户，请查看 [README.md](README.md) 了解如何通过 npm 安装使用。

---

## 📋 目录

- [开发环境要求](#开发环境要求)
- [从源码安装](#从源码安装)
- [项目结构](#项目结构)
- [开发调试](#开发调试)
- [测试](#测试)
- [发布流程](#发布流程)

---

## 🔧 开发环境要求

- **Node.js** >= 18.0.0
- **包管理器**: pnpm (推荐) / npm / yarn
- **Git** 版本控制

---

## 📦 从源码安装

### 1. 克隆仓库

```bash
git clone https://github.com/156554395/claude-account-switcher.git
cd claude-account-switcher
```

### 2. 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 链接到全局 (可选)

如果想在本地像全局包一样使用:

```bash
npm link
# 或使用 sudo (如果权限不足)
sudo npm link
```

链接后可以直接使用 `claude-account` 命令。

### 4. 验证安装

```bash
# 如果执行了 npm link
claude-account --version

# 或直接运行源码
node src/index.js --version
```

---

## 📁 项目结构

```
claude-account-switcher/
├── src/
│   ├── index.js              # CLI 入口,命令注册
│   ├── commands/             # 命令实现
│   │   ├── add.js           # 添加账号命令
│   │   ├── list.js          # 列出账号命令
│   │   ├── switch.js        # 切换账号命令
│   │   ├── current.js       # 查看当前账号命令
│   │   ├── test.js          # 测试账号命令
│   │   └── remove.js        # 删除账号命令
│   ├── config/               # 配置管理
│   │   └── manager.js       # 配置文件读写,账号管理
│   ├── utils/                # 工具函数
│   │   ├── validator.js     # 输入验证,API Key 掩码
│   │   ├── formatter.js     # 终端输出格式化
│   │   └── api-tester.js    # API 连通性测试
│   └── constants/            # 常量定义
│       └── defaults.js      # 默认配置值
├── .github/                  # GitHub 配置
│   ├── ISSUE_TEMPLATE/      # Issue 模板
│   └── pull_request_template.md
├── package.json              # 项目配置
├── README.md                 # 用户文档 (npm 用户)
├── DEVELOPMENT.md            # 开发文档 (本文件)
├── CONTRIBUTING.md           # 贡献指南
├── CHANGELOG.md              # 版本更新日志
├── LICENSE                   # MIT 许可证
└── .gitignore               # Git 忽略文件
```

### 核心模块说明

#### src/index.js
- CLI 入口文件
- 使用 Commander.js 注册所有命令
- 定义命令参数和选项

#### src/config/manager.js
- 配置文件管理核心类 `ConfigManager`
- 负责读写 `~/.claude/accounts.json`
- 提供账号增删改查接口
- 自动设置文件权限 (600)

#### src/commands/*.js
- 各个命令的具体实现
- 调用 ConfigManager 和工具函数
- 处理用户输入和输出

#### src/utils/*.js
- `validator.js`: 验证 API Key、账号名、URL 格式
- `formatter.js`: 终端输出美化 (成功/错误/警告)
- `api-tester.js`: 测试 API 连通性

---

## 🛠️ 开发调试

### 直接运行命令

在开发过程中,可以直接运行源码:

```bash
# 添加账号
node src/index.js add test-account sk-ant-xxx

# 列出账号
node src/index.js list

# 查看帮助
node src/index.js --help

# 查看某个命令的帮助
node src/index.js add --help
```

### 配置开发别名

在 `~/.zshrc` 或 `~/.bashrc` 添加开发别名:

```bash
# 开发环境别名
alias ca-dev='node /path/to/claude-account-switcher/src/index.js'
alias ca-dev-switch='eval $(node /path/to/claude-account-switcher/src/index.js switch $1)'
```

然后:

```bash
source ~/.zshrc  # 或 source ~/.bashrc
```

使用:

```bash
ca-dev list
ca-dev-switch personal
```

### 调试技巧

#### 1. 查看配置文件

```bash
cat ~/.claude/accounts.json
```

#### 2. 检查文件权限

```bash
ls -la ~/.claude/accounts.json
# 应该显示: -rw------- (600)
```

#### 3. 测试 API 连接

```bash
node src/index.js test --help
node src/index.js test your-account
```

#### 4. 查看环境变量

切换账号后:

```bash
echo $ANTHROPIC_API_KEY
echo $ANTHROPIC_API_URL
echo $ANTHROPIC_MODEL
echo $ANTHROPIC_SMALL_FAST_MODEL
```

---

## 🧪 测试

### 手动测试清单

在提交代码前,请确保以下功能正常:

- [ ] 添加账号 (基础)
  ```bash
  node src/index.js add test sk-ant-xxx
  ```

- [ ] 添加账号 (完整配置)
  ```bash
  node src/index.js add test sk-ant-xxx \
    --url "https://api.anthropic.com" \
    --model "claude-3-5-sonnet-20241022" \
    --small-model "claude-3-5-haiku-20241022"
  ```

- [ ] 添加账号并测试
  ```bash
  node src/index.js add test sk-ant-xxx --test
  ```

- [ ] 列出所有账号
  ```bash
  node src/index.js list
  ```

- [ ] 切换账号
  ```bash
  eval $(node src/index.js switch test)
  echo $ANTHROPIC_API_KEY  # 验证环境变量
  ```

- [ ] 查看当前账号
  ```bash
  node src/index.js current
  ```

- [ ] 测试账号连通性
  ```bash
  node src/index.js test test
  node src/index.js test  # 测试当前账号
  ```

- [ ] 删除账号 (交互式)
  ```bash
  node src/index.js remove test
  ```

- [ ] 删除账号 (强制)
  ```bash
  node src/index.js remove test --force
  ```

### 输入验证测试

- [ ] 无效的账号名 (包含特殊字符)
- [ ] 无效的 API Key (不以 sk-ant- 开头)
- [ ] 无效的 URL 格式
- [ ] 重复的账号名
- [ ] 删除不存在的账号
- [ ] 切换到不存在的账号

---

## 📤 发布流程

### 1. 更新版本号

编辑 `package.json`:

```json
{
  "version": "1.1.0"
}
```

### 2. 更新 CHANGELOG.md

添加新版本的更新内容:

```markdown
## [1.1.0] - 2025-01-10

### 新增
- 添加新功能 xxx

### 修复
- 修复 bug xxx
```

### 3. 提交代码

```bash
git add .
git commit -m "chore: release v1.1.0"
git tag v1.1.0
```

### 4. 推送到 GitHub

```bash
git push origin main
git push origin v1.1.0
```

### 5. 发布到 npm

```bash
# 确保已登录 npm
npm whoami

# 发布
npm publish
```

### 6. 创建 GitHub Release

1. 访问 https://github.com/156554395/claude-account-switcher/releases
2. 点击 "Draft a new release"
3. 选择 tag v1.1.0
4. 填写 Release 标题和说明
5. 发布

---

## 🤝 参与贡献

请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与项目贡献。

---

## 📞 联系方式

- **Issue**: https://github.com/156554395/claude-account-switcher/issues
- **Pull Request**: https://github.com/156554395/claude-account-switcher/pulls
- **Discussions**: https://github.com/156554395/claude-account-switcher/discussions

---

## 📝 常见开发问题

### Q: npm link 后命令不可用?

**A**: 检查以下几点:
1. 是否使用了 `sudo npm link`
2. 检查 npm 全局路径: `npm config get prefix`
3. 确保全局 bin 目录在 PATH 中
4. 重新打开终端

### Q: 修改代码后不生效?

**A**: 如果使用了 `npm link`:
1. 无需重新 link,代码修改即生效
2. 检查是否修改了正确的文件
3. 确认没有语法错误: `node src/index.js --version`

### Q: 配置文件在哪里?

**A**: `~/.claude/accounts.json`

### Q: 如何重置配置?

**A**:
```bash
rm -f ~/.claude/accounts.json
```

### Q: 如何卸载开发版本?

**A**:
```bash
npm unlink -g claude-account-switcher
# 或
sudo npm unlink -g claude-account-switcher
```

---

**祝开发愉快! 🚀**
