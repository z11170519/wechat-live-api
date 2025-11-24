// api/hello.js
export default function handler(req, res) {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const name = req.query.name || 'World';
  
  res.json({ 
    message: `Hello ${name}!`,
    timestamp: new Date().toISOString(),
    service: 'WeChat Live API - JavaScript'
  });
}