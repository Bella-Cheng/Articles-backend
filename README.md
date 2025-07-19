# Articles Backend API

一個使用 Node.js 和 Express 建立的文章管理 API，包含 Google 身份驗證功能。

## 📁 專案結構

```
Articles-backend/
├── src/
│   └── routes/
│       └── authGoogleRoutes.js    # Google 身份驗證路由
├── server.js                         # 主要應用程式檔案
├── package.json                   # 專案配置
├── .env                          # 環境變數
├── .prettierrc                   # Prettier 配置
├── .gitignore                    # Git 忽略檔案
├── README.md                     # 說明文件
└── PRETTIER.md                   # Prettier 使用教學
```

## 🚀 功能特色

- ✅ RESTful API 設計
- ✅ Google OAuth 身份驗證
- ✅ JWT Token 處理
- ✅ 環境變數配置
- ✅ Prettier 代碼格式化
- ✅ 健康檢查端點
- ✅ 記憶體內資料存儲（適合測試）

## 🛠️ 技術棧

- **Node.js** - 伺服器端運行環境
- **Express.js** - Web 應用程式框架
- **Google Auth Library** - Google 身份驗證
- **JWT** - JSON Web Token 身份驗證
- **Dotenv** - 環境變數管理
- **Prettier** - 代碼格式化工具

## 📦 安裝與執行

### 1. 安裝依賴套件

```bash
npm install
```

### 2. 設置環境變數

創建 `.env` 檔案並配置必要的環境變數：

```env
# Google OAuth 設定
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT 設定
JWT_SECRET=your_jwt_secret_key

# 伺服器設定
PORT=3000
```

### 3. 啟動伺服器

```bash
# 正式環境
npm start

# 開發環境（自動重啟）
npm run dev
```

伺服器會在 http://localhost:3000 啟動

### 4. 代碼格式化

```bash
npm run format
```

## 🔗 API 端點

### 基本端點

#### 健康檢查

```http
GET /health
```

#### 文章相關

```http
GET /api/articles
```

### Google 身份驗證

```http
POST /api/googleAuth/login
POST /api/googleAuth/verify
```

## 🧪 使用 Postman 測試

### 1. 健康檢查

```
GET http://localhost:3000/health
```

**預期回應：**

```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. 獲取文章列表

```
GET http://localhost:3000/api/articles
```

**預期回應：**

```json
{
  "success": true,
  "message": "成功獲取文章列表",
  "data": [
    {
      "id": 1,
      "title": "測試文章",
      "content": "這是一篇測試文章",
      "author": "測試作者"
    }
  ]
}
```

### 3. Google 身份驗證測試

```
POST http://localhost:3000/api/googleAuth/login
Content-Type: application/json

{
  "token": "your_google_id_token"
}
```

## 📋 開發指南

### 代碼風格

本專案使用 Prettier 進行代碼格式化。詳細使用方法請參考 [PRETTIER.md](./PRETTIER.md)

### 環境變數

- 開發環境：使用 `.env` 檔案
- 正式環境：設定系統環境變數

### Git 提交前

建議在提交前執行：

```bash
npm run format  # 格式化代碼
```

## 🤝 貢獻指南

1. Fork 此專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

MIT License
