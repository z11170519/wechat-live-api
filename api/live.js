// api/live.js - 多代理备用方案
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
          appid: appid ? '已配置' : '未配置',
          secret: secret ? '已配置' : '未配置'
        }
      });
    }

    console.log('尝试获取access_token...');

    // 方法1：直接尝试微信API（可能因IP白名单失败）
    try {
      const directTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
      const directResponse = await fetch(directTokenUrl, { timeout: 10000 });
      const tokenData = await directResponse.json();
      
      if (!tokenData.errcode) {
        console.log('直接调用微信API成功');
        return await getLiveRoomsWithToken(tokenData.access_token, start, limit, res);
      }
    } catch (directError) {
      console.log('直接调用失败:', directError.message);
    }

    // 方法2：使用自建代理方案 - 通过Vercel函数本身做中转
    const tokenResult = await getTokenThroughFunction(appid, secret);
    if (tokenResult.success) {
      return await getLiveRoomsWithToken(tokenResult.access_token, start, limit, res);
    }

    // 所有方法都失败
    res.json({
      success: false,
      error: '所有获取token的方法都失败了',
      suggestions: [
        '1. 在微信公众平台将Vercel的IP加入白名单',
        '2. 使用微信云开发',
        '3. 使用国内云服务商'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('最终错误:', error);
    res.json({
      success: false,
      error: '服务器内部错误',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// 使用token获取直播间列表
async function getLiveRoomsWithToken(accessToken, start, limit, res) {
  const liveUrl = `https://api.weixin.qq.com/wxa/business/getliveinfo?access_token=${accessToken}`;
  const liveResponse = await fetch(liveUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ start: parseInt(start), limit: parseInt(limit) })
  });

  const liveData = await liveResponse.json();

  res.json({
    success: true,
    message: '微信直播间数据获取成功',
    data: liveData,
    debug: { token_used: !!accessToken },
    timestamp: new Date().toISOString()
  });
}

// 自建代理方案 - 通过另一个Vercel函数中转
async function getTokenThroughFunction(appid, secret) {
  try {
    // 这里可以调用另一个专门处理token的API
    // 暂时返回失败，我们稍后实现
    return { success: false };
  } catch (error) {
    return { success: false, error: error.message };
  }
}