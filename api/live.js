// api/live.js - 使用 Cloudflare Workers 代理
export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { start = 0, limit = 10 } = req.query;
  
  try {
    const appid = process.env.APPID;
    const secret = process.env.APPSECRET;
    
    if (!appid || !secret) {
      return res.json({
        success: false,
        message: '请先在Vercel环境变量中配置APPID和APPSECRET',
        config_status: {
          appid: !!appid,
          secret: !!secret
        },
        timestamp: new Date().toISOString()
      });
    }

    console.log('通过 Cloudflare Worker 获取数据...');

    // 使用你的实际 Worker URL
    const workerUrl = `https://wechat-proxy.547067000.workers.dev/live?appid=${appid}&secret=${secret}&start=${start}&limit=${limit}`;
    
    const response = await fetch(workerUrl);
    const result = await response.json();

    // 返回结果
    res.json({
      success: true,
      message: '通过 Cloudflare Worker 获取成功',
      data: result.data,
      debug: {
        proxy: 'Cloudflare Worker',
        room_count: result.data.room_info ? result.data.room_info.length : 0,
        total: result.data.total || 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cloudflare Worker 错误:', error);
    res.json({
      success: false,
      error: '服务器内部错误',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}