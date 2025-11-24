import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { name = 'World' } = req.query;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.json({ 
    message: `Hello ${name}!`,
    timestamp: new Date().toISOString(),
    service: 'WeChat Live API'
  });
}