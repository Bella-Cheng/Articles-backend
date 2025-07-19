const express = require('express');
const app = express();
const PORT = 3000;
const googleAuthRoutes = require('./src/routes/authGoogleRoutes');

// 中間件
app.use(express.json());
app.use('/api/googleAuth', googleAuthRoutes);

// 簡單的資料存儲
let articles = [
  { id: 1, title: '測試文章', content: '這是一篇測試文章', author: '測試作者' },
];

// 測試端點 - 獲取所有文章
app.get('/api/articles', (req, res) => {
  res.json({
    success: true,
    message: '成功獲取文章列表',
    data: articles,
  });
});

// 健康檢查
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('📝 Test endpoints:');
  console.log('  GET /health - 健康檢查');
  console.log('  GET /api/articles - 獲取文章列表');
});
