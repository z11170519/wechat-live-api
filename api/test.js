// api/test.js - 纯 JavaScript，确保能工作
export default function handler(request, response) {
  response.status(200).json({
    message: "测试成功！",
    status: "working", 
    timestamp: new Date().toISOString(),
    path: request.url
  });
}