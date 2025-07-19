# 📝 Prettier 使用教學

Prettier 是一個固執己見的代碼格式化工具，支援多種程式語言，能夠自動格式化您的代碼，確保團隊代碼風格的一致性。

## 🎯 為什麼使用 Prettier？

- ✅ **自動格式化** - 無需手動調整代碼格式
- ✅ **團隊一致性** - 確保所有團隊成員使用相同的代碼風格
- ✅ **節省時間** - 不再需要在代碼審查中討論格式問題
- ✅ **減少錯誤** - 統一的格式減少閱讀錯誤
- ✅ **支援多語言** - JavaScript, TypeScript, JSON, CSS, HTML 等

## 🚀 快速開始

### 1. 安裝 Prettier

本專案已經預先安裝了 Prettier，您可以在 `package.json` 中看到：

```json
{
  "devDependencies": {
    "prettier": "^3.6.2"
  }
}
```

如果要在新專案中安裝：

```bash
# 安裝為開發依賴
npm install --save-dev prettier

# 或使用 yarn
yarn add --dev prettier
```

### 2. 配置 Prettier

本專案使用 `.prettierrc` 檔案進行配置：

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### 配置選項說明：

| 選項            | 說明                 | 預設值  |
| --------------- | -------------------- | ------- |
| `semi`          | 是否在語句結尾加分號 | `true`  |
| `trailingComma` | 尾隨逗號的處理方式   | `"es5"` |
| `singleQuote`   | 是否使用單引號       | `false` |
| `printWidth`    | 每行最大字元數       | `80`    |
| `tabWidth`      | 縮排空格數           | `2`     |
| `useTabs`       | 是否使用 Tab 縮排    | `false` |

## 💻 使用方法

### 1. 命令列執行

```bash
# 格式化所有檔案
npm run format

# 格式化特定檔案
npx prettier --write server.js

# 格式化特定資料夾
npx prettier --write src/

# 檢查格式但不修改檔案
npx prettier --check .
```

### 2. VS Code 整合

#### 安裝 VS Code 擴充功能：

1. 打開 VS Code
2. 前往擴充功能市集
3. 搜尋 "Prettier - Code formatter"
4. 安裝官方的 Prettier 擴充功能

#### 設定 VS Code：

在 VS Code 設定中加入：

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true
}
```

### 3. Git Hook 整合 (Pre-commit)

設定 Git Hook 可以在提交前自動格式化代碼，確保所有提交的代碼都符合格式標準。

#### 方法一：使用 Husky + lint-staged（推薦）

**步驟 1：安裝依賴套件**

```bash
npm install --save-dev husky lint-staged
```

**步驟 2：初始化 Husky**

```bash
npx husky install
```

**步驟 3：在 package.json 中加入配置**

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "git add"],
    "*.{json,md,yml,yaml}": ["prettier --write", "git add"]
  }
}
```

**步驟 4：創建 pre-commit hook**

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

**步驟 5：測試**

```bash
# 修改一些檔案後提交測試
git add .
git commit -m "test pre-commit hook"
```

#### 方法二：使用 pre-commit（Python 工具）

**步驟 1：安裝 pre-commit**

```bash
# 使用 pip 安裝
pip install pre-commit

# 或使用 brew（macOS）
brew install pre-commit
```

**步驟 2：創建 .pre-commit-config.yaml**

```yaml
repos:
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.0.0
    hooks:
      - id: prettier
        types_or: [javascript, jsx, ts, tsx, json, markdown, yaml]
```

**步驟 3：安裝 Git Hook**

```bash
pre-commit install
```

#### 方法三：簡單的 Git Hook

**創建 .git/hooks/pre-commit 檔案：**

```bash
#!/bin/sh
# 格式化暫存的檔案
npx prettier --write $(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx|json|md)$')

# 重新加入格式化後的檔案
git add $(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx|json|md)$')
```

**設定執行權限：**

```bash
chmod +x .git/hooks/pre-commit
```

## � Pre-commit Hook 詳細設定

Pre-commit hook 是確保代碼品質的重要工具，可以在每次提交前自動執行格式化、檢查等操作。

### 🚀 推薦設定：Husky + lint-staged

這是目前最受歡迎且穩定的解決方案。

#### 完整設定步驟

**1. 安裝必要套件**

```bash
npm install --save-dev husky lint-staged
```

**2. 初始化 Husky**

```bash
# 安裝 husky
npx husky install

# 設定 npm scripts（重要：確保其他開發者安裝依賴時自動設定）
npm pkg set scripts.prepare="husky install"
```

**3. 配置 lint-staged**

在 `package.json` 中加入 lint-staged 配置：

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],
    "*.{json,md,yml,yaml,css,scss}": ["prettier --write"]
  }
}
```

**4. 創建 pre-commit hook**

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

**5. 創建 commit-msg hook（可選）**

```bash
npx husky add .husky/commit-msg "npx commitlint --edit \$1"
```

#### 驗證設定

**測試 pre-commit hook：**

```bash
# 修改一個檔案
echo "const test = 'hello'" > test.js

# 加入暫存區
git add test.js

# 提交（會自動觸發格式化）
git commit -m "test: add test file"
```

### �🔧 進階配置選項

#### 針對不同檔案類型的配置

```json
{
  "lint-staged": {
    "*.{js,jsx}": ["prettier --write", "eslint --fix"],
    "*.{ts,tsx}": ["prettier --write", "tslint --fix"],
    "*.json": ["prettier --write"],
    "*.md": ["prettier --write", "markdownlint --fix"],
    "*.{css,scss}": ["prettier --write", "stylelint --fix"]
  }
}
```

#### 跳過特定檔案

在 `.lintstagedrc.js` 中使用更複雜的邏輯：

```javascript
module.exports = {
  '*.{js,jsx,ts,tsx}': (filenames) => {
    // 排除某些檔案
    const filteredFilenames = filenames.filter(
      (filename) => !filename.includes('legacy/')
    );

    return [
      `prettier --write ${filteredFilenames.join(' ')}`,
      `eslint --fix ${filteredFilenames.join(' ')}`,
    ];
  },
  '*.{json,md}': 'prettier --write',
};
```

### 🚨 常見問題與解決方案

#### 問題 1：hook 沒有執行權限

```bash
# 解決方案：設定執行權限
chmod +x .husky/pre-commit
```

#### 問題 2：Windows 上的路徑問題

```bash
# 在 .husky/pre-commit 中使用
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

#### 問題 3：某次提交需要跳過 hook

```bash
# 跳過 pre-commit hook
git commit --no-verify -m "urgent fix"

# 或設定環境變數
HUSKY=0 git commit -m "skip hooks"
```

#### 問題 4：hook 執行太慢

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "prettier --write"
      // 移除耗時的測試，改為 CI 中執行
    ]
  }
}
```

### 📋 最佳實踐

#### 1. 團隊協作

```bash
# 確保所有團隊成員都有相同的 hook 設定
git add .husky/
git commit -m "feat: add pre-commit hooks"
git push

# 其他成員拉取後需要執行
npm install  # 會自動執行 husky install
```

#### 2. CI/CD 整合

```yaml
# GitHub Actions 範例
name: Code Quality
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npx prettier --check .
      - run: npm run lint
```

#### 3. 段階式引入

```json
{
  "lint-staged": {
    // 階段1：只格式化
    "*.{js,jsx,ts,tsx}": ["prettier --write"]

    // 階段2：加入 linting（幾週後）
    // "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"]
  }
}
```

### 🎯 本專案的建議設定

根據此專案的需求，建議使用以下配置：

```json
{
  "scripts": {
    "prepare": "husky install",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "lint-staged": {
    "*.{js,jsx}": ["prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

**設定指令：**

```bash
# 1. 安裝套件
npm install --save-dev husky lint-staged

# 2. 初始化
npx husky install
npm pkg set scripts.prepare="husky install"

# 3. 創建 hook
npx husky add .husky/pre-commit "npx lint-staged"

# 4. 測試
git add .
git commit -m "feat: setup pre-commit hooks"
```

## 🔧 常用配置範例

### JavaScript/Node.js 專案

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### React 專案

```json
{
  "semi": false,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "jsxSingleQuote": true
}
```

### TypeScript 專案

```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2
}
```

## 📂 忽略檔案

創建 `.prettierignore` 檔案來忽略不需要格式化的檔案：

```
# 依賴套件
node_modules/
package-lock.json

# 建置輸出
dist/
build/

# 日誌檔案
*.log

# 環境變數
.env

# Git
.git/
```

## 🛠️ 本專案的 Prettier 設定

### 當前配置

查看 `.prettierrc` 檔案：

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 可用指令

```bash
# 格式化所有檔案
npm run format

# 檢查格式
npx prettier --check .

# 格式化特定檔案類型
npx prettier --write "**/*.js"
npx prettier --write "**/*.json"
npx prettier --write "**/*.md"
```

## 📋 最佳實踐

### 1. 團隊合作

- 在專案開始時就設定 Prettier 配置
- 確保所有團隊成員使用相同的配置
- 在 CI/CD 中加入格式檢查

### 2. 編輯器設定

- 啟用「儲存時自動格式化」
- 設定 Prettier 為預設格式化工具
- 安裝相關編輯器擴充功能

### 3. Git 工作流程

```bash
# 建議的開發流程
git add .
npm run format  # 格式化代碼
git add .       # 加入格式化後的變更
git commit -m "your commit message"
```

## 🔍 常見問題

### Q: Prettier 與 ESLint 衝突怎麼辦？

A: 安裝 `eslint-config-prettier` 來停用 ESLint 中與 Prettier 衝突的規則。

### Q: 如何在特定檔案中停用 Prettier？

A: 在檔案開頭加入 `// prettier-ignore` 註解。

### Q: Prettier 不格式化我的檔案？

A: 檢查檔案副檔名是否被支援，以及是否在 `.prettierignore` 中被忽略。

## 🔗 相關連結

- [Prettier 官方網站](https://prettier.io/)
- [Prettier 配置選項](https://prettier.io/docs/en/options.html)
- [VS Code Prettier 擴充功能](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Prettier 與 ESLint 整合](https://prettier.io/docs/en/integrating-with-linters.html)

---

## ⚡ 快速設定指南

如果您想要快速為此專案設定 pre-commit hook，請執行以下指令：

```bash
# 1. 安裝依賴
npm install --save-dev husky lint-staged

# 2. 初始化 Husky
npx husky install
npm pkg set scripts.prepare="husky install"

# 3. 在 package.json 中加入 lint-staged 配置
npm pkg set lint-staged.*.{js,jsx,json,md}="prettier --write"

# 4. 創建 pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"

# 5. 測試設定
echo "const test='hello'" > test.js
git add test.js
git commit -m "test: pre-commit hook setup"
# 檢查 test.js 是否被自動格式化為 const test = 'hello';
```

**提示：** 堅持使用 Prettier 和 pre-commit hooks 能夠讓您的代碼更加整潔和專業！
