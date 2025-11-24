import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 设置 CORS 头，允许所有域名访问（测试用）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求（预检请求）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只支持 GET 请求' });
  }

  const { start = '0', limit = '10' } = req.query;

  try {
    // 1. 获取 access_token
    const appid = process.env.APPID;
    const secret = process.env.APPSECRET;

    if (!appid || !secret) {
      return res.status(500).json({ 
        error: '服务器配置错误',
        message: '请设置 APPID 和 APPSECRET 环境变量'
      });
    }

    const tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.errcode) {
      return res.status(400).json({
        error: '获取 token 失败',
        details: tokenData
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
        start: parseInt(start as string),
        limit: parseInt(limit as string)
      })
    });

    const liveData = await liveResponse.json();

    // 3. 返回格式化数据
    return res.status(200).json({
      success: true,
      data: liveData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: '服务器内部错误',
      message: error instanceof Error ? error.message : '未知错误'
    });
  }
}