// api/live.js - 使用代理解决微信IP白名单问题
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
        message: '请先在Vercel环境变量中配置APPID和APPSECRET',
        config_status: {
          appid: appid ? '已配置' : '未配置',
          secret: secret ? '已配置' : '未配置'
        },
        timestamp: new Date().toISOString()
      });
    }

    console.log('开始获取微信access_token...');

    // 方法1：使用代理获取access_token（解决IP白名单问题）
    const proxyTokenUrl = `https://api.vvhan.com/api/wechat/token?appid=${appid}&secret=${secret}`;
    const tokenResponse = await fetch(proxyTokenUrl);
    const tokenData = await tokenResponse.json();
    
    if (tokenData.errcode) {
      return res.json({
        success: false,
        error: '获取access_token失败',
        details: tokenData,
        suggestion: '请检查APPID和APPSECRET是否正确',
        timestamp: new Date().toISOString()
      });
    }

    const accessToken = tokenData.access_token;
    console.log('成功获取access_token:', accessToken ? '是' : '否');

    // 2. 获取直播间列表 - 直接调用微信API（使用token一般不需要IP白名单）
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

    // 3. 返回数据
    res.json({
      success: true,
      message: '微信直播间数据获取成功',
      data: liveData,
      debug: {
        token_used: !!accessToken,
        room_count: liveData.room_info ? liveData.room_info.length : 0
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API错误:', error);
    res.json({
      success: false,
      error: '服务器内部错误',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}