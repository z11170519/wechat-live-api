// api/debug.js - 调试环境变量
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const appid = process.env.APPID;
  const secret = process.env.APPSECRET;
  
  res.json({
    environment_status: {
      appid: appid ? `已配置 (${appid.substring(0, 8)}...)` : '未配置',
      secret: secret ? `已配置 (${secret.substring(0, 8)}...)` : '未配置',
      node_env: process.env.NODE_ENV || '未设置'
    },
    timestamp: new Date().toISOString(),
    instructions: '如果环境变量未配置，请在Vercel的Settings > Environment Variables中设置APPID和APPSECRET'
  });
}