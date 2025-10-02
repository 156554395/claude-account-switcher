# 贡献指南

感谢你对 Claude Account Switcher 项目的关注!

> 📖 **开发者必读**: 在开始贡献之前，请先阅读 [开发文档 (DEVELOPMENT.md)](DEVELOPMENT.md) 了解项目结构、开发环境配置和调试方法。

---

## 如何贡献

### 报告问题

如果你发现了 bug 或有功能建议:

1. 在 [Issues](https://github.com/156554395/claude-account-switcher/issues) 页面搜索是否已有相关问题
2. 如果没有,创建一个新的 Issue
3. 提供尽可能详细的信息:
   - Bug: 重现步骤、预期行为、实际行为、环境信息
   - 功能建议: 使用场景、期望功能、可能的实现方案

### 提交代码

1. **Fork 项目**
   ```bash
   # 在 GitHub 上 Fork 项目
   # 克隆你的 Fork
   git clone https://github.com/your-username/claude-account-switcher.git
   cd claude-account-switcher
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **开发和测试**
   ```bash
   # 安装依赖
   pnpm install

   # 链接到全局（可选，方便测试）
   npm link

   # 进行修改
   # 测试你的修改
   claude-account [command]
   # 或直接运行源码
   node src/index.js [command]
   ```

   详细的开发调试方法请参考 [DEVELOPMENT.md](DEVELOPMENT.md)

4. **提交**
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   # 或
   git commit -m "fix: 修复某个问题"
   ```

5. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   # 在 GitHub 上创建 Pull Request
   ```

### 代码规范

- 使用 ES 模块语法 (`import`/`export`)
- 遵循现有代码风格
- 添加必要的注释和文档
- 确保代码可以正常运行

### 提交信息规范

使用语义化的提交信息:

- `feat: 添加新功能`
- `fix: 修复 bug`
- `docs: 更新文档`
- `refactor: 重构代码`
- `test: 添加测试`
- `chore: 构建/工具变动`

### Pull Request 规范

- 标题清晰描述改动
- 在描述中说明:
  - 改动的原因
  - 改动的内容
  - 相关的 Issue 编号
- 确保代码可以正常运行
- 更新相关文档(如果需要)

## 开发环境

- Node.js >= 18.0.0
- pnpm (推荐)

## 项目结构

```
claude-account-switcher/
├── src/
│   ├── index.js           # CLI 入口
│   ├── commands/          # 命令实现
│   ├── config/            # 配置管理
│   ├── utils/             # 工具函数
│   └── constants/         # 常量定义
├── package.json
├── README.md
└── LICENSE
```

## 问题反馈

如果你有任何问题,欢迎:

- 创建 [Issue](https://github.com/156554395/claude-account-switcher/issues)
- 参与 [Discussions](https://github.com/156554395/claude-account-switcher/discussions)

## 行为准则

- 尊重他人
- 建设性的讨论
- 欢迎新手提问

感谢你的贡献! 🎉
