import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const { name = 'World' } = req.query;
  res.json({ 
    message: `Hello ${name}!`,
    timestamp: new Date().toISOString()
  });
}