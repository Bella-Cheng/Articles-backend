const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { encrypt, decrypt } = require('../utils/encryption');
require('dotenv').config();

// 註冊
const userRegister = async (req, res) => {
  console.log("dwidhoiwdoqj")
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({
    success: false,
    error: '用戶名、密碼和姓名是必需的'
  });
  try {
    // 檢查用戶是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: encrypt(email) },
    });
    if (existingUser) return res.status(400).json({ success: false, error: '用戶已存在' });

    // 創建新用戶
    await prisma.user.create({
      data: {
        email: encrypt(email),
        password: encrypt(password),
        name: encrypt(name),
      },
    });
    // 成功
    res.status(200).json({ success: true, message: '用戶註冊成功' });
  } catch (err) {
    console.error('❌ 註冊失敗：', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// 登入
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    // 驗證用戶
    const user = await prisma.user.findFirst({
      where: { AND: [
      { email: encrypt(email) },
      { password: encrypt(password) }
    ],
    }});
    if (!user) return res.status(400).json({ success: false, error: '用戶名或密碼錯誤' });
    // 產生 JWT
    const token = jwt.sign(
      { id: user.id, email: decrypt(user.email), name: decrypt(user.name) },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, email: decrypt(user.email), name: decrypt(user.name) } });
  } catch (err) {
    console.error('❌ 登入失敗：', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = { userLogin, userRegister };
