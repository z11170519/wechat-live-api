// api/test-final.js - 完整测试
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const appid = process.env.APPID;
  const secret = process.env.APPSECRET;
  
  const envStatus = {
    appid: appid ? `已配置 (${appid.substring(0, 6)}...)` : '未配置',
    secret: secret ? `已配置 (${secret.substring(0, 6)}...)` : '未配置'
  };

  try {
    // 测试 Cloudflare Worker
    const workerUrl = `https://wechat-proxy.547067000.workers.dev/token?appid=${appid}&secret=${secret}`;
    const workerResponse = await fetch(workerUrl);
    const workerData = await workerResponse.json();

    res.json({
      environment: envStatus,
      cloudflare_worker: {
        url: 'wechat-proxy.547067000.workers.dev',
        status: workerData.success ? '工作正常' : '有错误',
        response: workerData
      },
      next_steps: workerData.success ? [
        '✅ Cloudflare Worker 配置正确',
        '✅ 微信凭据配置正确', 
        '🚀 现在可以测试 /api/live 接口了'
      ] : [
        '❌ 微信API返回错误，请检查APPID和APPSECRET',
        '📋 错误信息：' + (workerData.data?.errmsg || '未知错误')
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    res.json({
      environment: envStatus,
      error: '测试失败',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}