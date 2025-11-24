// api/live.js - 使用真实微信API
export default async function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { start = 0, limit = 10 } = req.query;
  
  try {
    // 检查环境变量
    const appid = process.env.APPID;
    const secret = process.env.APPSECRET;
    
    if (!appid || !secret) {
      return res.json({
        success: false,
        message: '请配置微信服务号APPID和APPSECRET环境变量',
        data: { room_info: [] },
        timestamp: new Date().toISOString()
      });
    }

    // 1. 获取 access_token
    const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();
    
    if (tokenData.errcode) {
      return res.json({
        success: false,
        error: '获取微信access_token失败',
        details: tokenData,
        timestamp: new Date().toISOString()
      });
    }

    const accessToken = tokenData.access_token;

    // 2. 获取直播间列表
    const liveUrl = `https://api.weixin.qq.com/wxa/business/getliveinfo?access_token=${accessToken}`;
    const liveResponse = await fetch(liveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start: parseInt(start),
        limit: parseInt(limit)
      })
    });

    const liveData = await liveResponse.json();

    // 3. 返回真实数据
    res.json({
      success: true,
      message: '真实微信直播间数据',
      data: liveData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error:', error);
    res.json({
      success: false,
      error: '服务器内部错误',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}