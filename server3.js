// 設置合適的表頭資訊：JSON與CORS
// JSON傳遞前先要轉成字串
const http = require('http');

const requestListener = (req, res)=>{ // req為承接client端所發送之內容變數，res為server端要返還的相關方法物件
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*', // CORS容許其他伺服器IP都可造訪
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE', // 支援方法
    'Content-Type': 'application/json'
  }
  // console.log(req);
  console.log(req.url);
  console.log(req.method);
  if(req.url === '/' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      'status': 'success',
      'data': [],
    }));
    res.end();
  }
  else{
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      'status': 'fail',
      'message': '404 not found',
    }));
    res.end();
  }
}

const server = http.createServer(requestListener);
server.listen(3005);