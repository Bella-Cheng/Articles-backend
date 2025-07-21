const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const crypto = require('crypto');

const MerchantID = process.env.MERCHANT_ID;
const HashKey = process.env.HASH_KEY;
const HashIV = process.env.HASH_IV;
const PaymentUrl = process.env.PAYMENT_URL;
const NotifyURL = process.env.ECPAY_NOTIFY_URL;

// 檢查碼產生（SHA256）
function genCheckMacValue(params) {
  const keys = Object.keys(params).sort();
  let raw = 'HashKey=' + HashKey;
  keys.forEach(key => {
    raw += `&${key}=${params[key]}`;
  });
  raw += '&HashIV=' + HashIV;

  let urlEncoded = encodeURIComponent(raw)
    .replace(/%20/g, '+')
    .replace(/'/g, '%27')
    .replace(/~/g, '%7e')
    .replace(/%21/g, '!')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')
    .replace(/%2a/g, '*')
    .toLowerCase();

  const hash = crypto.createHash('sha256');
  hash.update(urlEncoded);
  return hash.digest('hex').toUpperCase();
}

// 自動送出綠界表單
function generateAutoSubmitForm(action, params) {
  let form = `<form id="ecpayForm" method="POST" action="${action}">`;
  Object.entries(params).forEach(([k, v]) => {
    form += `<input type="hidden" name="${k}" value="${v}"/>`;
  });
  form += '</form>';
  form += `<script>document.getElementById('ecpayForm').submit();</script>`;
  return form;
}

const forwardToEcPay = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const orderId = req.params?.id;

    if (!userId) return res.status(401).json({ message: '請登入' });
    if (!orderId) return res.status(400).json({ message: '請傳入訂單編號' });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order || order.userId !== userId) {
      return res.status(404).send('訂單不存在');
    }
    if (order.status !== 'pending') {
      return res.status(400).send('訂單狀態不允許付款');
    }

    const itemNames = order.items.map(i => `${i.name}x${i.count}`).join('#');
    const params = {
      MerchantID: String(MerchantID),
      MerchantTradeNo: String(order.merchantTradeNo),
      MerchantTradeDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      PaymentType: 'aio',
      TotalAmount: String(order.totalAmount),
      TradeDesc: '網站訂單付款',
      ItemName: itemNames,
      ReturnURL: NotifyURL,
      ChoosePayment: 'Credit',
      EncryptType: '1'
    };

    params.CheckMacValue = genCheckMacValue(params);
    const html = generateAutoSubmitForm(PaymentUrl, params);
    res.send(html);

  } catch (err) {
    console.error('forwardToEcPay error', err);
    res.status(500).send('系統發生錯誤，請稍後再試');
  }
};

module.exports = { forwardToEcPay };