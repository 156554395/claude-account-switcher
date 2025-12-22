# NPM 发布设置指南

本指南说明如何配置 GitHub Actions 以实现自动发布到 NPM。

## 前置要求

1. 在 [npmjs.com](https://www.npmjs.com/) 注册账号
2. 确保你有 `claude-account-switcher` 包的发布权限

## 配置步骤

### 1. 生成 NPM Access Token

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击右上角头像 → "Access Tokens"
3. 点击 "Generate New Token"
4. 选择 token 类型：
   - **Automation** - 用于 CI/CD 自动化发布（推荐）
   - **Classic** - 传统 token，可以设置过期时间
5. 设置 token 名称（例如：`github-actions-publish`）
6. 复制生成的 token（只显示一次）

### 2. 在 GitHub 仓库中添加 Secret

1. 进入 GitHub 仓库：`156554395/claude-account-switcher`
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 设置：
   - **Secret name**: `NPM_TOKEN`
   - **Secret value**: 粘贴刚才复制的 NPM token
5. 点击 **Add secret**

### 3. 发布新版本

#### 方式一：通过 GitHub Releases（推荐）

1. 在 GitHub 上点击 **Releases** → **Draft a new release**
2. 设置版本号（遵循语义化版本：`v1.1.2`）
3. 填写发布说明
4. 点击 **Publish release**
5. GitHub Actions 会自动：
   - 运行测试
   - 发布到 NPM
   - 在 Actions 标签页显示发布状态

#### 方式二：手动触发

1. 进入 **Actions** 标签页
2. 找到 **Publish to NPM** workflow
3. 点击 **Run workflow**
4. 选择分支（通常是 `main`）
5. 点击 **Run workflow** 按钮

## 验证发布

发布成功后，可以通过以下方式验证：

```bash
# 检查最新版本
npm view claude-account-switcher version

# 安装测试
npm install -g claude-account-switcher
claude-account --version
```

## 故障排除

### 问题：权限错误 (403)

**原因**: NPM token 没有发布权限或包名冲突

**解决**:
- 确保 token 类型是 **Automation** 或有发布权限的 **Classic**
- 检查包名是否已被占用
- 确认你有该包的维护者权限

### 问题：认证失败 (401)

**原因**: NPM_TOKEN 未正确设置或已过期

**解决**:
- 检查 GitHub Secret 名称是否为 `NPM_TOKEN`
- 重新生成 token 并更新 GitHub Secret
- 确保 token 没有过期

### 问题：测试失败导致发布中断

**原因**: 代码存在 bug 或测试不通过

**解决**:
- 本地运行 `npm test` 修复所有测试
- 确保所有测试通过后再创建 release

## 安全建议

1. **Token 过期**: 如果使用 Classic token，设置合理的过期时间
2. **最小权限**: 使用 Automation token 限制权限范围
3. **定期轮换**: 定期更新 token 以提高安全性
4. **私有仓库**: 确保 GitHub 仓库设置为私有（如果包含敏感信息）

## CI/CD 流程说明

workflow 触发条件：
- 当创建新的 GitHub Release 时自动触发
- 可以手动在 Actions 页面触发

执行步骤：
1. ✅ 检出代码
2. ✅ 设置 Node.js 20 环境
3. ✅ 安装依赖 (`npm ci`)
4. ✅ 运行测试 (`npm test`)
5. ✅ 发布到 NPM (`npm publish`)
6. ✅ 输出成功消息

如果任何步骤失败，整个 workflow 会停止，确保不会发布有问题的版本。