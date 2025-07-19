const crypto = require('crypto');

// 32 字元的 key，請改成你的安全字串
const ENCRYPTION_KEY =
  process.env.CRYPTO_KEY || '12345678901234567890123456789012';

// 固定 IV (16 bytes)
const IV = Buffer.from('1234567890123456'); // 16字節，自己定一組固定字串即可

function encrypt(text) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    IV
  );
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted; // 因為 IV 固定，這結果每次一樣
}

function decrypt(encryptedText) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    IV
  );
  let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
