// routes/auth.js
const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 假資料庫模擬
const users = {}; // 用 email 當 key

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/google', async (req, res) => {
  console.log('🔍 收到的 req.body:', req.body);
  
  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ error: 'Missing id_token' });

  console.log('🔍 環境變數 GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
  console.log('🔍 收到的 id_token:', id_token.substring(0, 50) + '...');

  try {
    // 驗證 Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log(ticket)

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // 查詢資料庫或創建帳號
    let user = users[email];
    if (!user) {
      // 註冊新帳號（實際應該寫入資料庫）
      user = {
        id: googleId,
        email,
        name,
        picture,
        createdAt: new Date(),
      };
      users[email] = user;
      console.log('🔐 新用戶註冊：', user);
    } else {
      console.log('✅ 用戶登入：', user);
    }

    // 產生 JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error('❌ 驗證失敗：', err);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

module.exports = router;
