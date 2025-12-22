# NPM 发布设置指南

本指南说明如何配置 GitHub Actions 以实现自动发布到 NPM。

## 前置要求

1. 在 [npmjs.com](https://www.npmjs.com/) 注册账号
2. 确保你有 `claude-account-switcher` 包的发布权限
3. **重要**: 2024年12月后，npm 要求所有发布者启用多因素认证 (MFA)

## ⚠️ 重要说明：2024年12月 MFA 变更

**npm 在 2024年12月实施了新的安全要求**：

- ✅ **所有包发布者必须启用 MFA**
- ✅ **只有 Automation 类型的 token 可用于 CI/CD**
- ✅ **生成 token 时需要 MFA 验证**
- ✅ **Classic tokens 在 MFA 后功能受限**

这意味着你**必须**先启用 MFA，然后才能生成用于 GitHub Actions 的 token。

## 配置步骤

### 1. 启用 MFA（必需）

由于 npm 在 2024 年 12 月实施了新的 MFA 要求，你必须先启用 MFA：

1. 登录 [npmjs.com](https://www.npmjs.com/)
2. 点击右上角头像 → **"Access Tokens"**
3. 如果提示需要 MFA，点击 **"Enable MFA"** 或 **"设置多因素认证"**
4. 选择 MFA 类型：
   - **Authenticator App** (推荐) - 使用 Google Authenticator、Authy 等
   - **SMS** - 短信验证
5. 扫描二维码或输入密钥到认证器应用
6. 保存恢复代码（非常重要！）
7. 输入验证码完成设置

### 2. 生成 Automation Token

启用 MFA 后，按以下步骤生成 Automation Token：

1. 在 **"Access Tokens"** 页面，点击 **"Generate New Token"**
2. 选择 **"Automation"** 类型（这是唯一支持 CI/CD 的类型）
3. 设置 token 名称（例如：`github-actions-publish`）
4. **重要**: 你需要完成 MFA 验证才能生成 token
5. 复制生成的 token（只显示一次，务必保存）

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

### 问题：无法生成 Automation Token，提示需要 MFA

**原因**: 2024年12月后，npm 强制要求 MFA

**解决**:
1. 先按照上面的步骤启用 MFA
2. 使用认证器应用（Authenticator App）设置
3. 保存好恢复代码
4. 重新登录后再次尝试生成 token

### 问题：权限错误 (403)

**原因**: NPM token 没有发布权限或包名冲突

**解决**:
- 确保 token 类型是 **Automation**（Classic token 在 MFA 后可能受限）
- 检查包名是否已被占用
- 确认你有该包的维护者权限
- 确保 MFA 已正确启用

### 问题：认证失败 (401)

**原因**: NPM_TOKEN 未正确设置或已过期

**解决**:
- 检查 GitHub Secret 名称是否为 `NPM_TOKEN`
- 重新生成 token（需要 MFA 验证）
- 更新 GitHub Secret
- 确保 token 没有过期

### 问题：MFA 验证码不工作

**原因**: 时间不同步或输入错误

**解决**:
- 确保你的认证器应用和服务器时间同步
- 在有效期内输入 6 位验证码
- 如果持续失败，使用恢复代码重置 MFA

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