// api/live.js - 修复数据格式问题
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

    // 使用你的 Worker URL
    const workerUrl = `https://wechat-proxy.547067000.workers.dev/live?appid=${appid}&secret=${secret}&start=${start}&limit=${limit}`;
    
    const response = await fetch(workerUrl);
    const result = await response.json();

    // 如果 Worker 返回错误，直接返回
    if (!result.success) {
      return res.json({
        success: false,
        error: 'Cloudflare Worker 返回错误',
        details: result,
        timestamp: new Date().toISOString()
      });
    }

    // 返回成功结果
    res.json({
      success: true,
      message: '通过 Cloudflare Worker 获取成功',
      data: result.data,
      debug: {
        proxy: 'Cloudflare Worker',
        room_count: result.debug.room_count,
        total: result.debug.total
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