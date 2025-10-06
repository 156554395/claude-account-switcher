# Shell 配置说明

## 为什么使用函数而不是 alias？

在 shell 中，`alias` 只是简单的文本替换，**不支持参数传递**。例如：

```bash
# ❌ 错误示例 - alias 无法传递参数
alias claude-use='eval $(claude-account use $1)'
# 当你运行 claude-use personal 时，$1 不会被替换为 personal
```

正确的做法是使用 **shell 函数**：

```bash
# ✅ 正确示例 - 函数支持参数传递
claude-use() { eval $(claude-account use "$@"); }
# "$@" 会将所有参数正确传递给命令
```

---

## Bash/Zsh 配置

在 `~/.zshrc` 或 `~/.bashrc` 中添加：

```bash
# Claude Account Switcher 快捷函数
claude-use() { eval $(claude-account use "$@"); }
claude-list() { claude-account list "$@"; }
claude-test() { claude-account test "$@"; }
claude-current() { claude-account current "$@"; }
claude-add() { claude-account add "$@"; }
claude-remove() { claude-account remove "$@"; }
```

刷新配置：

```bash
source ~/.zshrc  # 或 source ~/.bashrc
```

---

## PowerShell 配置

在 `$PROFILE` 中添加：

```powershell
function claude-use {
  param([string]$AccountName)
  Invoke-Expression (& claude-account use $AccountName)
}

function claude-list {
  & claude-account list
}

function claude-current {
  & claude-account current
}

function claude-test {
  param([string]$AccountName)
  & claude-account test $AccountName
}
```

重新加载配置：

```powershell
. $PROFILE
```

---

## Fish Shell 配置

在 `~/.config/fish/config.fish` 中添加：

```fish
function claude-use
    eval (claude-account use $argv)
end

function claude-list
    claude-account list $argv
end

function claude-current
    claude-account current $argv
end

function claude-test
    claude-account test $argv
end
```

重新加载配置：

```fish
source ~/.config/fish/config.fish
```

---

## 使用示例

配置完成后，即可使用简洁的命令：

```bash
# 切换账号
claude-use personal

# 列出所有账号
claude-list

# 查看当前账号
claude-current

# 测试账号
claude-test personal

# 添加账号
claude-add work sk-ant-xxx

# 删除账号
claude-remove work
```

---

## 技术说明

### `"$@"` vs `$1`

- **`$1`**: 只传递第一个参数
- **`"$@"`**: 传递所有参数，并保持参数的完整性（包括空格）

示例：

```bash
# 使用 $1
myfunc() { echo "First: $1"; }
myfunc hello world
# 输出: First: hello

# 使用 "$@"
myfunc() { echo "All: $@"; }
myfunc hello world
# 输出: All: hello world
```

### 为什么 `eval` 需要函数？

`eval` 命令需要在**当前 shell** 中执行，以便修改环境变量。使用函数可以确保：

1. 命令在当前 shell 中运行
2. 参数正确传递
3. 环境变量立即生效

---

## 故障排查

### 问题：函数无法使用

**原因**：可能配置文件未刷新

**解决**：

```bash
# Bash/Zsh
source ~/.zshrc  # 或 ~/.bashrc

# Fish
source ~/.config/fish/config.fish

# PowerShell
. $PROFILE
```

### 问题：参数传递失败

**检查**：确保使用 `"$@"` 而不是 `$1`

```bash
# ❌ 错误
claude-use() { eval $(claude-account use $1); }

# ✅ 正确
claude-use() { eval $(claude-account use "$@"); }
```

### 问题：环境变量未生效

**检查**：确保使用了 `eval`

```bash
# ❌ 错误 - 环境变量不会生效
claude-use() { claude-account use "$@"; }

# ✅ 正确 - 使用 eval 使环境变量生效
claude-use() { eval $(claude-account use "$@"); }
```
