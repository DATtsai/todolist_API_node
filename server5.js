// 建立取得所有代辦清單API
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const todos = [ // 先放些測試用資料確定回傳正確
  { 
    'title': 'item1',
    'id': uuidv4(),
  },
  { 
    'title': 'item2',
    'id': uuidv4(),
  },
]; // 暫存在本機記憶體上，之後要改到伺服器DB上

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
  else if(req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      'status': 'success',
      'data': todos,
    }));
    res.end();
  }
  else if(req.method === 'OPTIONS') {
    res.writeHead(200, headers);
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