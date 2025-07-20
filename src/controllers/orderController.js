const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();

// 產生給綠界用的訂單編號
function genMerchantTradeNo() {
  return uuidv4().replace(/-/g, '').slice(0, 20);
}
// 產生給消費者看的訂單編號
function genOrderNo() {
  const pad = (n) => n.toString().padStart(2, '0');
  const now = new Date();
  return `ORD${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${Math.floor(Math.random() * 1000)}`;
}

const createOrder = async (req, res) => {
  const userId = req.user?.id;
  const { items } = req.body;

  if (!userId) {
    return res.status(401).json({ message: '請登入' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: '訂單商品不可為空' });
  }

  for (const item of items) {
    if (!item.name || !item.count || !item.amount) {
      return res.status(400).json({ message: '商品資訊不完整' });
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + Number(item.amount), 0);

  const orderNo = genOrderNo();
  const merchantTradeNo = genMerchantTradeNo();

  try {
    const order = await prisma.order.create({
      data: {
        id: uuidv4(),
        orderNo,
        merchantTradeNo,
        userId,
        totalAmount,
        items: {
          create: items.map((item) => ({
            id: uuidv4(),
            name: item.name,
            count: Number(item.count),
            amount: Number(item.amount),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json({
      message: '訂單已成立',
      order,
    });
  } catch (err) {
    console.error('訂單成立發生錯誤', err);
    res.status(500).json({ message: '訂單成立發生錯誤', error: err.message });
  }
};

const cancelOrder = async(req, res) => {
  const userId = req.user?.id;
  const { orderId } = req.body;

  if(!userId){
    return res.status(401).json({ message: '請登入' });
  }
  if(!orderId){
    return res.status(401).json({ message: '請傳入訂單編號' });
  }

  try{
    const order  = prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order || order.userId !== userId) {
      return res.status(404).json({ message: '找不到訂單' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ message: '訂單已付款，無法取消' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: '此訂單目前狀態不可取消' });
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'canceled' }
    });

    res.json({ message: '訂單已成功取消' });


  }catch(err){
    console.error('取消訂單發生錯誤', err);
    res.status(500).json({ message: '取消訂單發生錯誤', error: err.message });
  }
}

module.exports = { createOrder, cancelOrder };
