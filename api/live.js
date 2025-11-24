// api/live.js
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
  
  // 返回测试数据
  res.json({
    success: true,
    message: '直播间API（JavaScript版本）',
    data: {
      room_info: [
        {
          roomid: 1,
          name: '测试直播间 - JavaScript',
          live_status: 102,
          start_time: Math.floor(Date.now() / 1000),
          anchor_name: '测试主播',
          anchor_wechat: 'test_anchor'
        },
        {
          roomid: 2,
          name: '另一个测试直播间',
          live_status: 101,
          start_time: Math.floor(Date.now() / 1000) - 3600,
          anchor_name: '主播二号'
        }
      ]
    },
    timestamp: new Date().toISOString()
  });
}