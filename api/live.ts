// api/live.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 暂时返回测试数据，等基础功能正常后再接入微信API
  return res.json({
    success: true,
    message: '直播间API正常工作，但尚未配置微信凭据',
    data: {
      room_info: [
        {
          roomid: 1,
          name: '测试直播间',
          live_status: 102,
          start_time: Math.floor(Date.now() / 1000),
          anchor_name: '测试主播'
        }
      ]
    },
    timestamp: new Date().toISOString()
  });
}