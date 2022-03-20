// 處理合法路由與不合法404頁面
const http = require('http');

const requestListener = (req, res)=>{ // req為承接client端所發送之內容變數，res為server端要返還的相關方法物件
  const headers = {
    'Content-Type': 'text/plain'
  }
  // console.log(req);
  console.log(req.url);
  console.log(req.method);
  if(req.url === '/' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write('index');
    res.end();
  }
  else if(req.url === '/' && req.method === 'DELETE') {
    res.writeHead(200, headers);
    res.write('delete success!');
    res.end();
  }
  else{
    res.writeHead(404, headers);
    res.write('404 not found');
    res.end();
  }
}

const server = http.createServer(requestListener);
server.listen(3005);