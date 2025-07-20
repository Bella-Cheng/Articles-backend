const express = require('express');
const cors = require('./src/config/cors');
const app = express();
const PORT = 3000;
const googleAuthRoutes = require('./src/routes/authGoogleRoutes');
const userRoutes = require('./src/routes/userRoutes');

// 中間件
app.use(express.json());
cors(app);
app.use('/api/googleAuth', googleAuthRoutes);
app.use('/api/user', userRoutes);

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
});
