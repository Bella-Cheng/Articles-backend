const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { encrypt, decrypt } = require('.././utils/encryption');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authGoogleLogin = async (req, res) => {
  const { id_token } = req.body;
  if (!id_token) return res.status(400).json({ error: 'Missing id_token' });

  try {
    // 驗證 Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;
    // 查詢資料庫或創建帳號
    let user = await prisma.user.findUnique({
      where: { providerUserId: googleId },
    });
    if (!user) {
      // 註冊新帳號（實際應該寫入資料庫）
      user = await prisma.user.create({
        data: {
          email: encrypt(email),
          name: encrypt(name),
          password: '', // 第三方登入不需要密碼，可設空
          providerUserId: googleId,
          modifier: 'google', // 你可以寫來源
        },
      });
      console.log('🔐 新用戶註冊：', user.id);
    } else {
      console.log('✅ 用戶登入：', user.id);
    }

    // 產生 JWT
    const decryptedUser = {
      ...user,
      email: decrypt(user.email),
      name: decrypt(user.name),
    };

    const token = jwt.sign(
      { id: user.id, email: decryptedUser.email, name: decryptedUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: decryptedUser });
  } catch (err) {
    console.error('❌ 驗證失敗：', err);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};

module.exports = { authGoogleLogin };
